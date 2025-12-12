import { NextRequest } from 'next/server';
import { SITE_AUTH, createRateLimiter, handleLogin } from '@/lib/auth';

const rateLimiter = createRateLimiter(SITE_AUTH);

export async function POST(request: NextRequest) {
  return handleLogin(request, SITE_AUTH, rateLimiter);
}
