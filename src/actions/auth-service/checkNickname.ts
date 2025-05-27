import { useQuery } from '@tanstack/react-query';

/**
 * 닉네임 중복 확인 API
 * @param nickname 확인할 닉네임
 * @returns 중복 여부 (true: 사용 가능, false: 중복)
 */
export async function checkNicknameAvailability(
  nickname: string,
): Promise<boolean> {
  try {
    // 실제 API 호출 구현
    // const response = await instance.get<{ available: boolean }>(`/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
    // return response.available;

    // 임시 구현 (API 연동 전)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 테스트를 위해 'admin'과 'test'는 중복으로 처리
    const reservedNicknames = ['호초', '호촐', '김호철', '멋쟁이'];
    return !reservedNicknames.includes(nickname.toLowerCase());
  } catch (error) {
    console.error('닉네임 중복 확인 중 오류:', error);
    throw error;
  }
}

/**
 * 닉네임 중복 확인을 위한 쿼리 훅
 * @param nickname 확인할 닉네임
 * @param enabled 자동 쿼리 활성화 여부
 */
export function useCheckNicknameAvailability(
  nickname: string,
  enabled = false,
) {
  return useQuery({
    queryKey: ['checkNickname', nickname],
    queryFn: () => checkNicknameAvailability(nickname),
    enabled: enabled && nickname.length >= 2,
    staleTime: Infinity, // 같은 닉네임은 한 번만 체크
  });
}
