import { createMocks } from '@/tests/utils/mockReqRes';
import { getSession } from 'next-auth/react';
import fetchMock from 'jest-fetch-mock';

// Mock next-auth getSession
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
}));

// Simplified Mock cheerio
jest.mock('cheerio', () => ({
  load: jest.fn(() => {
    return (selector: string) => {
      if (selector === 'head title') {
        return { text: () => 'Mocked Title' };
      }
      if (selector === 'link[rel="icon"]') {
        return { attr: (attribute: string) => (attribute === 'href' ? '/mock-favicon.ico' : null) };
      }
      if (selector === 'link[rel="shortcut icon"]') {
        return { attr: (attribute: string) => (attribute === 'href' ? null : null) };
      }
      return { text: () => '', attr: () => null };
    };
  }),
}));

// Mock supabase client globally
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

// Import handler after all mocks are defined
import handler from 'pages/api/bookmarks';
import { supabase } from '@/lib/supabase';

describe('/api/bookmarks', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    (getSession as jest.Mock).mockResolvedValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
    });

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset the mock implementation for supabase.from for each test
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };

      if (tableName === 'bookmarks') {
        mockQuery.insert.mockImplementation(function () {
          return {
            select: jest.fn(function () {
              return {
                single: jest.fn(() => ({
                  data: {
                    id: 'test-id',
                    user_id: 'test-user-id',
                    url: 'http://test.com',
                    title: 'Mocked Title',
                    favicon: 'http://test.com/mock-favicon.ico',
                    summary: 'Mocked Summary',
                    created_at: new Date().toISOString(),
                    tags: [],
                  },
                  error: null,
                })),
              };
            }),
          };
        });

        mockQuery.select.mockImplementation(function () {
          const mockBookmarks = [
            { id: '1', url: 'http://bookmark1.com', user_id: 'test-user-id' },
            { id: '2', url: 'http://bookmark2.com', user_id: 'test-user-id' },
          ];
          return {
            eq: jest.fn(function () {
              return {
                order: jest.fn(() => ({
                  data: mockBookmarks,
                  error: null,
                })),
              };
            }),
          };
        });

        mockQuery.delete.mockImplementation(function () {
          return {
            eq: jest.fn(function () {
              return {
                eq: jest.fn(() => ({
                  error: null,
                })),
              };
            }),
          };
        });
      } else if (tableName === 'users') {
        mockQuery.select.mockImplementation(function () {
          return {
            eq: jest.fn(function () {
              return {
                single: jest.fn(() => ({
                  data: { id: 'test-user-id', email: 'test@example.com', hashed_password: 'hashed_password' },
                  error: null,
                })),
              };
            }),
          };
        });
      }
      return mockQuery;
    });

    fetchMock.mockResponse((req) => {
      if (req.url.startsWith('https://r.jina.ai/')) {
        return Promise.resolve('Mocked Summary');
      } else if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
        return Promise.resolve('<html><head><title>Mocked Title</title><link rel="icon" href="/mock-favicon.ico"></head><body></body></html>');
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no session', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    const { req, res } = createMocks({ method: 'GET' });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData()).toEqual({ message: 'Unauthorized' });
  });

  it('POST /api/bookmarks should create a new bookmark', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { url: 'http://example.com' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getData()).toEqual({
      id: 'test-id',
      user_id: 'test-user-id',
      url: 'http://test.com',
      title: 'Mocked Title',
      favicon: 'http://test.com/mock-favicon.ico',
      summary: 'Mocked Summary',
      created_at: expect.any(String),
      tags: [],
    });
    expect(supabase.from).toHaveBeenCalledWith('bookmarks');
    expect(supabase.from('bookmarks').insert).toHaveBeenCalledWith({
      user_id: 'test-user-id',
      url: 'http://example.com',
      title: 'Mocked Title',
      favicon: 'http://test.com/mock-favicon.ico',
      summary: 'Mocked Summary',
    });
  });

  it('GET /api/bookmarks should return a list of bookmarks', async () => {
    const mockBookmarks = [
      { id: '1', url: 'http://bookmark1.com', user_id: 'test-user-id' },
      { id: '2', url: 'http://bookmark2.com', user_id: 'test-user-id' },
    ];

    // Explicitly set the return value for the select chain in this test
    (supabase.from('bookmarks').select as jest.Mock).mockImplementationOnce(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockBookmarks,
          error: null,
        })),
      })),
    }));

    const { req, res } = createMocks({ method: 'GET' });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockBookmarks);
    expect(supabase.from).toHaveBeenCalledWith('bookmarks');
    expect(supabase.from('bookmarks').select).toHaveBeenCalledWith('*');
    expect(supabase.from('bookmarks').select().eq).toHaveBeenCalledWith(
      'user_id',
      'test-user-id'
    );
  });

  it('DELETE /api/bookmarks should delete a bookmark', async () => {
    // Explicitly set the return value for the delete chain in this test
    (supabase.from('bookmarks').delete as jest.Mock).mockImplementationOnce(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null,
        })),
      })),
    }));

    const { req, res } = createMocks({
      method: 'DELETE',
      query: { id: 'bookmark-to-delete-id' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(204);
    expect(supabase.from).toHaveBeenCalledWith('bookmarks');
    expect(supabase.from('bookmarks').delete).toHaveBeenCalled();
    expect(supabase.from('bookmarks').delete().eq).toHaveBeenCalledWith(
      'id',
      'bookmark-to-delete-id'
    );
    expect(supabase.from('bookmarks').delete().eq().eq).toHaveBeenCalledWith(
      'user_id',
      'test-user-id'
    );
  });
});
