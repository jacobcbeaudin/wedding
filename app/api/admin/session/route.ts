import { ADMIN_AUTH, handleSession } from '@/lib/auth';

export async function GET() {
  return handleSession(ADMIN_AUTH);
}
