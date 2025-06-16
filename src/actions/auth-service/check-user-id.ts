'use server';

export async function checkUserIdAvailability(
  userId: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1/auth/check-id?userId=${userId}`,
    );
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error('Check user ID availability error:', error);
    throw error;
  }
}
