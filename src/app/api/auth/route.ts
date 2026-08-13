import { NextResponse } from 'next/server';
import { DEMO_USERS } from '@/modules/auth/auth.types';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    users: Object.values(DEMO_USERS),
  });
}
