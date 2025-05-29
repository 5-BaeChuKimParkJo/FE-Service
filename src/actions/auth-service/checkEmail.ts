'use server';

export async function checkEmailAvailability(email: string): Promise<boolean> {
  // 실제 API 호출 구현
  // const response = await instance.get<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  // return response.available;

  // 임시 구현 (API 연동 전)
  console.log(email);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true; // 항상 사용 가능하다고 응답
}
