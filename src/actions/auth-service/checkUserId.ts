import { useQuery } from '@tanstack/react-query';

/**
 * 아이디 중복 확인 API
 * @param userId 확인할 아이디
 * @returns 중복 여부 (true: 사용 가능, false: 중복)
 */
export async function checkUserIdAvailability(
  userId: string,
): Promise<boolean> {
  try {
    // 실제 API 호출 구현
    // const response = await instance.get<{ available: boolean }>(`/auth/check-userId?userId=${encodeURIComponent(userId)}`);
    // return response.available;

    // 임시 구현 (API 연동 전)
    console.log(userId);

    await new Promise((resolve) => setTimeout(resolve, 800));

    // 테스트를 위해 'admin', 'test', 'user' 등은 중복으로 처리
    const reservedUserIds = ['admin', 'test', 'user', 'root', 'system'];
    return !reservedUserIds.includes(userId.toLowerCase());
  } catch (error) {
    console.error('아이디 중복 확인 중 오류:', error);
    throw error;
  }
}

/**
 * 아이디 중복 확인을 위한 쿼리 훅
 * @param userId 확인할 아이디
 * @param enabled 자동 쿼리 활성화 여부
 */
export function useCheckUserIdAvailability(userId: string, enabled = false) {
  return useQuery({
    queryKey: ['checkUserId', userId],
    queryFn: () => checkUserIdAvailability(userId),
    enabled: enabled && userId.length >= 4 && /^[a-zA-Z0-9_]+$/.test(userId),
    staleTime: Infinity, // 같은 아이디는 한 번만 체크
  });
}
