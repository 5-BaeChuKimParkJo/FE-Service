'use server';

import { getApiBaseUrl } from '@/config/server';

export async function checkNicknameAvailability(
  nickname: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/auth-service/api/v1/auth/exists/nickname?nickname=${encodeURIComponent(nickname)}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Check nickname availability error:', error);
    throw error;
  }
}
