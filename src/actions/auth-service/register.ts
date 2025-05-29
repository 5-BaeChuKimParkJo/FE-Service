'use server';

export interface RegisterUserData {
  phoneNumber: string;
  nickname: string;
  userId: string;
  password: string;
  interests?: string[];
}

export interface RegisterResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export async function registerUser(
  userData: RegisterUserData,
): Promise<RegisterResponse> {
  // 실제 API 호출 구현
  // return await instance.post<RegisterResponse>('/auth/register', userData);

  if (!userData) {
    //나중에 지울 예정
    console.log('');
  }
  // 임시 구현 (API 연동 전)
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    userId: 'user_' + Math.random().toString(36).substr(2, 9),
  };
}
