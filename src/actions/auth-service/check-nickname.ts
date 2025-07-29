'use server';

export async function checkNicknameAvailability(
  nickname: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1/auth/exists/nickname?nickname=${nickname}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Check nickname availability error:', error);
    throw error;
  }
}
