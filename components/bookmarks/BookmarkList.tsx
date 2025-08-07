import React, { useState } from 'react';
import { Bookmark } from '@/lib/types';
import BookmarkCard from './BookmarkCard';
import BookmarkDetail from './BookmarkDetail';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkDeleted: (id: string) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  onBookmarkDeleted,
}) => {
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');

  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)));

  const filteredBookmarks = filterTag
    ? bookmarks.filter((bookmark) => bookmark.tags.includes(filterTag))
    : bookmarks;

  return (
    <div className="mt-8 p-6 bg-[#FFFFFF] dark:bg-[#1E1E1E] rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-[#212121] dark:text-[#E0E0E0] border-b pb-4 border-[#E0E0E0] dark:border-[#2C2C2C]">
        Your Saved Links
      </h2>

      {allTags.length > 0 && (
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label htmlFor="tagFilter" className="text-lg font-medium text-[#212121] dark:text-[#E0E0E0] whitespace-nowrap">
            Filter by Tag:
          </label>
          <select
            id="tagFilter"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="p-3 border border-[#E0E0E0] rounded-md w-full sm:w-auto flex-grow dark:bg-[#1E1E1E] dark:border-[#2C2C2C] dark:text-[#E0E0E0] focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition duration-200 ease-in-out"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredBookmarks.length === 0 ? (
        <p className="text-center text-2xl text-[#757575] dark:text-[#A0A0A0] py-16 border-2 border-dashed border-[#E0E0E0] dark:border-[#2C2C2C] rounded-lg">
          No bookmarks found. Start by adding one above!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch transition-all duration-300 ease-in-out">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onViewDetails={setSelectedBookmark}
              onDelete={onBookmarkDeleted}
            />
          ))}
        </div>
      )}

      {selectedBookmark && (
        <BookmarkDetail
          bookmark={selectedBookmark}
          onClose={() => setSelectedBookmark(null)}
        />
      )}
    </div>
  );
};

export default BookmarkList;