import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { supabase } from '@/lib/supabase';
import { Bookmark } from '@/lib/types';

const JINA_AI_SUMMARY_ENDPOINT = 'https://r.jina.ai/';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id || !session.supabaseAccessToken || !session.refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: session.supabaseAccessToken,
    refresh_token: session.refreshToken,
  });

  if (sessionError) {
    return res.status(401).json({ message: 'Error setting Supabase session' });
  }

  const userId = session.user.id;

  switch (req.method) {
    case 'POST':
      try {
        const { url, tags } = req.body;
        if (!url) {
          return res.status(400).json({ message: 'URL is required' });
        }

        let title: string | null = null;
        let favicon: string | null = null;
        try {
          const urlResponse = await fetch(url);
          const html = await urlResponse.text();
          const cheerio = require('cheerio');
          const $ = cheerio.load(html);
          title = $('head title').text() || null;
          favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || null;
          if (favicon && !favicon.startsWith('http')) {
            const urlObj = new URL(url);
            favicon = `${urlObj.protocol}//${urlObj.host}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
          }
        } catch (error) {
          // Continue without title/favicon if fetching fails
        }

        let summary: string | null = null;
        try {
          const encodedUrl = encodeURIComponent(url);
          const summaryResponse = await fetch(`${JINA_AI_SUMMARY_ENDPOINT}${encodedUrl}`);
          if (summaryResponse.ok) {
            summary = await summaryResponse.text();
          }
        } catch (error) {
          // Continue without summary if fetching fails
        }

        const { data, error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: userId,
            url,
            title,
            favicon,
            summary,
            tags,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        res.status(201).json(data);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'GET':
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        res.status(200).json(data);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: 'Bookmark ID is required' });
        }

        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', id as string)
          .eq('user_id', userId);

        if (error) {
          throw new Error(error.message);
        }

        res.status(204).end();
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}