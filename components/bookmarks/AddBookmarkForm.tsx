import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Bookmark } from '@/lib/types';

interface AddBookmarkFormProps {
  onBookmarkAdded: (bookmark: Bookmark) => void;
}

const AddBookmarkForm: React.FC<AddBookmarkFormProps> = ({
  onBookmarkAdded,
}) => {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const tagsArray = tags.split(',').map((tag) => tag.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, tags: tagsArray }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add bookmark');
      }

      const newBookmark: Bookmark = await response.json();
      onBookmarkAdded(newBookmark);
      setUrl('');
      setTags('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8 border border-[#E0E0E0] dark:border-[#2C2C2C]">
      <h2 className="text-2xl font-bold mb-5 text-[#212121] dark:text-[#E0E0E0]">Add New Bookmark</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <Input
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full mb-4 sm:mb-0"
            label="URL"
          />
          <Input
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full"
            label="Tags (Optional)"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </form>
      {error && <p className="text-[#DC3545] text-sm mt-3">{error}</p>}
    </div>
  );
};

export default AddBookmarkForm;
