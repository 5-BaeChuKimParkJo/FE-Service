/**
 * 이메일 중복 확인 API
 * @param email 확인할 이메일
 * @returns 중복 여부 (true: 사용 가능, false: 중복)
 */
export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    // 실제 API 호출 구현
    // const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    // if (!response.ok) throw new Error('API 호출 실패');
    // const data = await response.json();
    // return data.available;

    // 임시 구현 (API 연동 전)
    console.log(email);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true; // 항상 사용 가능하다고 응답
  } catch (error) {
    console.error('이메일 중복 확인 중 오류:', error);
    throw error;
  }
}

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
    // const response = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
    // if (!response.ok) throw new Error('API 호출 실패');
    // const data = await response.json();
    // return data.available;

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
 * 회원가입 API
 * @param userData 사용자 데이터
 * @returns 가입 결과
 */
export async function registerUser(userData: {
  phoneNumber: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
  interests?: string[];
}): Promise<{ success: boolean; userId?: string; message?: string }> {
  try {
    // 실제 API 호출 구현
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userData),
    // });
    // if (!response.ok) throw new Error('API 호출 실패');
    // return await response.json();

    if (!userData) {
      //나중에 지울 예정
      console.log('');
    }
    // 임시 구현 (API 연동 전)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      success: true,
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
    };
  } catch (error) {
    console.error('회원가입 중 오류:', error);
    throw error;
  }
}
