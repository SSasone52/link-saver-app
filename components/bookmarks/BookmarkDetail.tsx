import React from 'react';
import { Bookmark } from '@/lib/types';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BookmarkDetailProps {
  bookmark: Bookmark;
  onClose: () => void;
}

const BookmarkDetail: React.FC<BookmarkDetailProps> = ({
  bookmark,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 bg-[#121212] bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose} // Close when clicking outside the modal
    >
      <div
        className="bg-[#FFFFFF] dark:bg-[#1E1E1E] rounded-lg shadow-2xl p-6 w-full max-w-2xl relative transform transition-all scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#757575] hover:text-[#212121] dark:hover:text-[#E0E0E0] text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="max-h-[90vh] overflow-y-auto pr-4"> {/* Added max-h and overflow-y-auto here */}
          <h2 className="text-3xl font-extrabold mb-4 flex items-center text-[#212121] dark:text-[#E0E0E0]">
            {bookmark.favicon && (
              <Image
                src={bookmark.favicon}
                alt="Favicon"
                width={28}
                height={28}
                className="mr-3 rounded-full"
              />
            )}
            {bookmark.title || 'No Title'}
          </h2>
          <p className="text-[#007BFF] dark:text-[#66B2FF] mb-4 break-words">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-lg"
            >
              {bookmark.url}
            </a>
          </p>
          <div className="mb-4">
            <h3 className="font-semibold text-[#212121] dark:text-[#E0E0E0] text-lg">Summary:</h3>
            <div className="text-[#757575] dark:text-[#A0A0A0] leading-relaxed prose dark:prose-invert max-w-none">
              {bookmark.summary ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {bookmark.summary}
                </ReactMarkdown>
              ) : (
                'No summary available.'
              )}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-[#212121] dark:text-[#E0E0E0] text-lg">Created At:</h3>
            <p className="text-[#757575] dark:text-[#A0A0A0]">
              {new Date(bookmark.created_at).toLocaleString()}
            </p>
          </div>
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-[#212121] dark:text-[#E0E0E0] text-lg">Tags:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {bookmark.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#E0E0E0] text-[#007BFF] text-sm font-medium px-3 py-1 rounded-full dark:bg-[#1E1E1E] dark:text-[#66B2FF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-[#E0E0E0] dark:border-[#2C2C2C]">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkDetail;