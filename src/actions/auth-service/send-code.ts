'use server';

// import { instance } from '../instance';

export async function sendCode(phoneNumber: string) {
  // await instance.post(`/identity-verification/sms/send`, {
  //   phoneNumber: phoneNumber,
  //   purpose: 'SIGN_UP',
  // });

  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log('sendCode', phoneNumber);
  return true;
}
