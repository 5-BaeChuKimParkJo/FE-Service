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

    // 쿠키 설정 수정 개발용
    const cookieOptions = {
      httpOnly: true,
      secure: false, // 개발환경에서는 false로 설정
      sameSite: 'lax' as const, // strict에서 lax로 변경
      path: '/',
    };

    // 쿠키 설정 수정 운영용
    // const cookieOptions = {
    //   httpOnly: true,
    //   secure: true, // 개발환경에서는 false로 설정
    //   sameSite: 'strict' as const, // strict에서 lax로 변경
    //   path: '/',
    // };

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
