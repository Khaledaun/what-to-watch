import { describe, it, expect, beforeEach } from 'vitest';

// Mock process.env for testing
const originalEnv = process.env;

describe('Environment Variables', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it('should validate required TMDB_API_KEY', () => {
    process.env.TMDB_API_KEY = 'test-key';
    
    expect(() => {
      // This would normally import and validate env
      const { env } = require('@/lib/env');
      expect(env.TMDB_API_KEY).toBe('test-key');
    }).not.toThrow();
  });

  it('should fail without TMDB_API_KEY', () => {
    delete process.env.TMDB_API_KEY;
    
    expect(() => {
      require('@/lib/env');
    }).toThrow('TMDB_API_KEY is required');
  });

  it('should set default values', () => {
    process.env.TMDB_API_KEY = 'test-key';
    
    const { env } = require('@/lib/env');
    expect(env.DEFAULT_COUNTRIES).toBe('US,CA');
    expect(env.CACHE_TTL_SECONDS).toBe(900);
    expect(env.NODE_ENV).toBe('development');
  });

  it('should validate NODE_ENV enum', () => {
    process.env.TMDB_API_KEY = 'test-key';
    process.env.NODE_ENV = 'invalid';
    
    expect(() => {
      require('@/lib/env');
    }).toThrow();
  });
});