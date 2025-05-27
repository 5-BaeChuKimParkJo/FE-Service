import { useQuery } from '@tanstack/react-query';

export async function checkEmailAvailability(email: string): Promise<boolean> {
  // 실제 API 호출 구현
  // const response = await instance.get<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  // return response.available;

  // 임시 구현 (API 연동 전)
  console.log(email);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true; // 항상 사용 가능하다고 응답
}

export function useCheckEmailAvailability(email: string, enabled = false) {
  return useQuery({
    queryKey: ['checkEmail', email],
    queryFn: () => checkEmailAvailability(email),
    enabled:
      enabled && email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    staleTime: Infinity,
  });
}
