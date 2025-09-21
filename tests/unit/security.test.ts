import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateSearchParams } from '@/lib/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe('img src="x" onerror="alert(1)"');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('JAVASCRIPT:alert(1)')).toBe('alert(1)');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('should handle normal text', () => {
      expect(sanitizeInput('normal text')).toBe('normal text');
    });
  });

  describe('validateSearchParams', () => {
    it('should sanitize URL search parameters', () => {
      const params = new URLSearchParams({
        q: '<script>alert(1)</script>',
        platform: 'netflix',
        mood: 'feel-good',
      });

      const result = validateSearchParams(params);
      
      expect(result.q).toBe('scriptalert(1)/script');
      expect(result.platform).toBe('netflix');
      expect(result.mood).toBe('feel-good');
    });

    it('should filter out long values', () => {
      const longValue = 'a'.repeat(1001);
      const params = new URLSearchParams({
        q: 'normal',
        long: longValue,
      });

      const result = validateSearchParams(params);
      
      expect(result.q).toBe('normal');
      expect(result.long).toBeUndefined();
    });

    it('should handle empty params', () => {
      const params = new URLSearchParams();
      const result = validateSearchParams(params);
      
      expect(result).toEqual({});
    });
  });
});
