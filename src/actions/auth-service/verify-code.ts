'use server';

import { instance } from '../instance';

export async function verifyCode(
  phoneNumber: string,
  verificationCode: string,
) {
  const response = await instance.post<boolean>(
    `/auth-service/api/v1/identity-verification/sms/verify`,
    {
      phoneNumber: phoneNumber,
      verificationCode: verificationCode,
      purpose: 'SIGN_UP',
    },
  );
  return response;

  // await new Promise((resolve) => setTimeout(resolve, 1500));
  // console.log('verifyCode', phoneNumber, verificationCode);
  // return true;
}
