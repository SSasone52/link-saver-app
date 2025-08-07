import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password, type } = req.body;

  if (!email || !password || !type) {
    return res.status(400).json({ message: 'Email, password, and type are required' });
  }

  try {
    if (type === 'signup') {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            hashed_password: hashedPassword,
          },
        },
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json({ message: 'User signed up successfully', user: data.user });
    } else if (type === 'login') {
      const { data: user, error: signInError } = await supabase
        .from('users')
        .select('id, email, hashed_password')
        .eq('email', email)
        .single();

      if (signInError || !user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // For custom credentials, you might need to manually set a session or return a token
      // NextAuth.js handles session creation automatically when using its signIn function
      return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    }

    return res.status(400).json({ message: 'Invalid authentication type' });
  } catch (error: any) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
