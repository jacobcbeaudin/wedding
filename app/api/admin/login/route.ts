import { NextRequest } from 'next/server';
import { ADMIN_AUTH, createRateLimiter, handleLogin } from '@/lib/auth';

const rateLimiter = createRateLimiter(ADMIN_AUTH);

export async function POST(request: NextRequest) {
  return handleLogin(request, ADMIN_AUTH, rateLimiter);
}
