'use server';

export interface RegisterUserData {
  phoneNumber: string;
  nickname: string;
  userId: string;
  password: string;
  interests?: string[];
}

// export interface RegisterResponse {
//   success: boolean;
//   userId?: string;
//   message?: string;
// }

export async function registerUser(userData: RegisterUserData) {
  // 실제 API 호출 구현
  // await instance.post('/auth-service/api/v1/auth/sign-up', {
  //   memberId: userData.userId,
  //   password: userData.password,
  //   nickname: userData.nickname,
  //   phoneNumber: userData.phoneNumber,
  // });

  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1/auth/sign-up`,
    {
      method: 'POST',
      body: JSON.stringify({
        memberId: userData.userId,
        password: userData.password,
        nickname: userData.nickname,
        phoneNumber: userData.phoneNumber,
      }),
    },
  );
}
