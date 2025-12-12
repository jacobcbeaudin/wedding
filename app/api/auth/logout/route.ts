import { SITE_AUTH, handleLogout } from '@/lib/auth';

export async function POST() {
  return handleLogout(SITE_AUTH);
}
