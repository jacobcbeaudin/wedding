import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/admin';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);

  const authenticated = session?.value ? await verifyAdminToken(session.value) : false;

  return NextResponse.json({ authenticated });
}
