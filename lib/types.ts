export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  favicon: string | null;
  summary: string | null;
  created_at: string;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
}