'use server';

import { instance } from '../instance';

export async function verifyCode(
  phoneNumber: string,
  verificationCode: string,
) {
  const response = await instance.post<boolean>(
    `/identity-verification/sms/verify`,
    {
      phoneNumber: phoneNumber,
      verificationCode: verificationCode,
      purpose: 'SIGN_UP',
    },
  );
  return response;
}
