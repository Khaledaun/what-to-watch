import { NextRequest, NextResponse } from 'next/server';

export function createSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}

export function withSecurityHeaders(response: NextResponse) {
  const headers = createSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

export function validateSearchParams(params: URLSearchParams) {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    if (typeof value === 'string' && value.length < 1000) {
      sanitized[key] = sanitizeInput(value);
    }
  }
  
  return sanitized;
}

export function createCORSHeaders(origin?: string) {
  const allowedOrigins = [
    'https://whattowatch.com',
    'https://www.whattowatch.com',
    'http://localhost:3000',
  ];
  
  const isAllowed = origin && allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}
