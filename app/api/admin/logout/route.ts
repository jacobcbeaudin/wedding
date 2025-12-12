import { ADMIN_AUTH, handleLogout } from '@/lib/auth';

export async function POST() {
  return handleLogout(ADMIN_AUTH);
}
