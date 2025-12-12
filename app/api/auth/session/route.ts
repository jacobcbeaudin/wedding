import { SITE_AUTH, handleSession } from '@/lib/auth';

export async function GET() {
  return handleSession(SITE_AUTH);
}
