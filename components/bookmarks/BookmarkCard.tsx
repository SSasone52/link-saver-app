import React from 'react';
import { Bookmark } from '@/lib/types';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onViewDetails: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onViewDetails,
  onDelete,
}) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      try {
        const response = await fetch(`/api/bookmarks?id=${bookmark.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete bookmark');
        }
        onDelete(bookmark.id);
      } catch (error) {
        // Error deleting bookmark
      }
    }
  };

  const displayTitle = bookmark.title && bookmark.title.length > 0 ? bookmark.title : new URL(bookmark.url).hostname;

  return (
    <div className="bg-[#F8F8F8] dark:bg-[#1E1E1E] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 flex flex-col justify-between border border-[#E0E0E0] dark:border-[#2C2C2C] transform hover:-translate-y-1 group h-full">
      <div className="flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          {bookmark.favicon ? (
            <Image
              src={bookmark.favicon}
              alt="Favicon"
              width={28}
              height={28}
              className="mr-4 rounded-full object-contain shadow-md"
            />
          ) : (
            <div className="w-7 h-7 mr-4 rounded-full bg-[#E0E0E0] dark:bg-[#2C2C2C] flex items-center justify-center text-[#757575] dark:text-[#A0A0A0] text-lg font-semibold shadow-md">
              {displayTitle.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-xl font-bold text-[#212121] dark:text-[#E0E0E0] flex-grow break-words leading-tight group-hover:text-[#007BFF] dark:group-hover:text-[#66B2FF] transition-colors duration-300">
            {displayTitle}
          </h3>
        </div>
        <div className="text-[#757575] dark:text-[#A0A0A0] text-base mb-4 overflow-hidden flex-grow">
          <div className="line-clamp-5">
            {bookmark.summary ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {bookmark.summary}
              </ReactMarkdown>
            ) : (
              'No summary available.'
            )}
          </div>
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007BFF] hover:underline text-sm font-medium block break-all group-hover:text-[#0056b3] dark:group-hover:text-[#3399FF] transition-colors duration-300"
        >
          {bookmark.url}
        </a>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button onClick={() => onViewDetails(bookmark)} size="md" className="w-full">
          View Details
        </Button>
        <Button onClick={handleDelete} variant="danger" size="md" className="w-full">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BookmarkCard;