import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Bookmark } from '@/lib/types';
import BookmarkList from '@/components/bookmarks/BookmarkList';
import AddBookmarkForm from '@/components/bookmarks/AddBookmarkForm';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DashboardProps {
  bookmarks: Bookmark[];
}

const Dashboard: React.FC<DashboardProps> = ({ bookmarks: initialBookmarks }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  const handleBookmarkAdded = (newBookmark: Bookmark) => {
    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-gray-900 dark:text-gray-100 leading-tight">
        Your <span className="text-[#007BFF] dark:text-[#66B2FF]">Bookmarks</span>
      </h1>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={handleBookmarkDeleted} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user?.id || !session.supabaseAccessToken || !session.refreshToken) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: session.supabaseAccessToken,
    refresh_token: session.refreshToken,
  });

  if (sessionError) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return {
      props: {
        session,
        bookmarks: [],
      },
    };
  }

  return {
    props: {
      session,
      bookmarks: data as Bookmark[],
    },
  };
};

export default Dashboard;