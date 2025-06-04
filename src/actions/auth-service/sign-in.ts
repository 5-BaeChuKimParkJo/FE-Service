'use server';

import { instance } from '../instance';

export async function signIn(memberId: string, password: string) {
  const response = await instance.post('/auth-service/api/v1/auth/sign-in', {
    memberId: memberId,
    password: password,
  });
  return response;
}
