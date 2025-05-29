'use server';

import { instance } from '../instance';

/**
 * 아이디 중복 확인 API
 * @param userId 확인할 아이디
 * @returns 중복 여부 (true: 사용 가능, false: 중복)
 */
export async function checkUserIdAvailability(
  userId: string,
): Promise<boolean> {
  // 실제 API 호출 구현
  const response = await instance.get<boolean>(
    `/auth/exists/member-id/${userId}`,
  );
  return !response;

  // // 임시 구현 (API 연동 전)
  // console.log(userId);

  // await new Promise((resolve) => setTimeout(resolve, 800));

  // // 테스트를 위해 'admin', 'test', 'user' 등은 중복으로 처리
  // const reservedUserIds = ['admin', 'test', 'user', 'root', 'system'];
  // return !reservedUserIds.includes(userId.toLowerCase());
}
