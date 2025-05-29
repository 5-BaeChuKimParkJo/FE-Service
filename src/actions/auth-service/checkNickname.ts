'use server';

/**
 * 닉네임 중복 확인 API
 * @param nickname 확인할 닉네임
 * @returns 중복 여부 (true: 사용 가능, false: 중복)
 */
export async function checkNicknameAvailability(
  nickname: string,
): Promise<boolean> {
  // 실제 API 호출 구현
  // const response = await instance.get<{ available: boolean }>(`/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  // return response.available;

  // 임시 구현 (API 연동 전)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 테스트를 위해 'admin'과 'test'는 중복으로 처리
  const reservedNicknames = ['호초', '호촐', '김호철', '멋쟁이'];
  return !reservedNicknames.includes(nickname.toLowerCase());
}
