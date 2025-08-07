import { isValidUrl } from '@/lib/utils';

describe('isValidUrl', () => {
  it('should return true for a valid URL', () => {
    expect(isValidUrl('https://www.example.com')).toBe(true);
  });

  it('should return true for a valid URL with path', () => {
    expect(isValidUrl('https://www.example.com/path/to/page')).toBe(true);
  });

  it('should return true for a valid URL with query parameters', () => {
    expect(isValidUrl('https://www.example.com?param=value')).toBe(true);
  });

  it('should return true for a valid URL with hash', () => {
    expect(isValidUrl('https://www.example.com#section')).toBe(true);
  });

  it('should return false for an invalid URL', () => {
    expect(isValidUrl('invalid-url')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });

  it('should return false for a URL without protocol', () => {
    expect(isValidUrl('www.example.com')).toBe(false);
  });

  it('should return false for a malformed URL', () => {
    expect(isValidUrl('http://')).toBe(false);
  });
});
