'use server';

export interface RegisterUserData {
  phoneNumber: string;
  nickname: string;
  userId: string;
  password: string;
  interests?: string[];
}

export async function registerUser(userData: RegisterUserData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1/auth/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: userData.userId,
          password: userData.password,
          nickname: userData.nickname,
          phoneNumber: userData.phoneNumber,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `회원가입 실패: ${response.status}`);
    }

    try {
      const responseText = await response.text();
      return responseText ? JSON.parse(responseText) : {};
    } catch {
      return {};
    }
  } catch (error) {
    console.error('Register user error:', error);
    throw error;
  }
}
