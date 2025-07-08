'use server';

import { cookies } from 'next/headers';

export async function signOut() {
  const cookieStore = await cookies();

  // try {
  //   await instance.get('/auth-service/api/v1/auth/sign-out');
  // } catch (error) {
  //   console.error('Sign out API failed:', error);
  // }
  // console.log('signOut 성공');

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('memberUuid');
}
