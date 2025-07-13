'use server';

import { cookies } from 'next/headers';

interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  memberUuid: string;
}

export async function signIn(memberId: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1/auth/sign-in`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberId,
          password: password,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SignInResponse = await response.json();

    const cookieStore = cookies();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax' as const,
      path: '/',
    };

    (await cookieStore).set('accessToken', data.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 1일
    });

    (await cookieStore).set('refreshToken', data.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 14, // 14일
    });

    (await cookieStore).set('memberUuid', data.memberUuid, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 1일
    });

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}
