/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 이름 유효성 검사
 */
export function validateName(name: string): string {
  if (!name) return '이름을 입력해주세요.';
  if (name.length < 2) return '이름은 2자 이상이어야 합니다.';
  return '';
}

/**
 * 닉네임 유효성 검사
 */
export function validateNickname(nickname: string): string {
  if (!nickname) return '닉네임을 입력해주세요.';
  if (nickname.length < 2) return '닉네임은 2자 이상이어야 합니다.';
  if (nickname.length > 10) return '닉네임은 10자 이하여야 합니다.';
  return '';
}

/**
 * 이메일 형식 유효성 검사
 */
export function validateEmailFormat(email: string): string {
  if (!email) return '이메일을 입력해주세요.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return '유효한 이메일 형식이 아닙니다.';
  return '';
}

/**
 * 비밀번호 유효성 검사 함수
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }

  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }

  // 추가적인 비밀번호 규칙 검사 가능
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
  //   return {
  //     isValid: false,
  //     message:
  //       '비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
  //   };
  // }

  return { isValid: true };
}

/**
 * 비밀번호 일치 여부 검사 함수
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): { isValid: boolean; message?: string } {
  if (!confirmPassword) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }

  return { isValid: true };
}

/**
 * 아이디 유효성 검사
 */
export function validateUserId(userId: string): string {
  if (!userId) return '아이디를 입력해주세요.';
  if (userId.length < 4) return '아이디는 4자 이상이어야 합니다.';
  if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
    return '아이디는 영문, 숫자, 언더스코어(_)만 사용 가능합니다.';
  }
  return '';
}
