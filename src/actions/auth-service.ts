'use server';
import { cookies } from 'next/headers';

interface Session {
  user?: {
    accessToken?: string;
    memberUuid?: string;
  };
}

export async function auth(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const memberUuid = cookieStore.get('memberUuid')?.value;

    if (!accessToken) {
      return null;
    }

    return {
      user: {
        accessToken,
        memberUuid,
      },
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}
