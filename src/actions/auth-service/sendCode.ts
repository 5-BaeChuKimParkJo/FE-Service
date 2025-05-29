'use server';

import { instance } from '../instance';

export async function sendCode(phoneNumber: string) {
  await instance.post(`/identity-verification/sms/send`, {
    phoneNumber: phoneNumber,
    purpose: 'SIGN_UP',
  });
}
