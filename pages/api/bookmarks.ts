import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { Bookmark } from '@/lib/types';

const JINA_AI_SUMMARY_ENDPOINT = 'https://r.jina.ai/';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies[name],
        set: (name: string, value: string, options: any) => {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; Max-Age=${options.maxAge || 2592000}`);
        },
        remove: (name: string, options: any) => {
          res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`);
        },
      },
    }
  );

  const { data: { session } } = await supabaseServer.auth.getSession();

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
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

        const { data, error } = await supabaseServer
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
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'An unknown error occurred' });
        }
      }
      break;

    case 'GET':
      try {
        const { data, error } = await supabaseServer
          .from('bookmarks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        res.status(200).json(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'An unknown error occurred' });
        }
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: 'Bookmark ID is required' });
        }

        const { error } = await supabaseServer
          .from('bookmarks')
          .delete()
          .eq('id', id as string)
          .eq('user_id', userId);

        if (error) {
          throw new Error(error.message);
        }

        res.status(204).end();
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'An unknown error occurred' });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}