'use server';

import { getApiBaseUrl } from '@/config/server';

export async function checkUserIdAvailability(
  userId: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/auth-service/api/v1/auth/exists/member-id?memberId=${encodeURIComponent(userId)}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Check user ID availability error:', error);
    throw error;
  }
}
