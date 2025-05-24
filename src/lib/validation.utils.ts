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
export const validateName = (name: string): string =>
  name.trim() ? '' : '이름을 입력해주세요.';

/**
 * 닉네임 유효성 검사
 */
export const validateNickname = (nickname: string): string => {
  if (!nickname.trim()) return '닉네임을 입력해주세요.';
  if (nickname.length < 2) return '닉네임은 2자 이상이어야 합니다.';
  return '';
};

/**
 * 이메일 형식 유효성 검사
 */
export const validateEmailFormat = (email: string): string => {
  if (!email.trim()) return '이메일을 입력해주세요.';
  if (!validateEmail(email)) return '올바른 이메일 형식이 아닙니다.';
  return '';
};

/**
 * 비밀번호 유효성 검사 함수
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }

  // 추가적인 비밀번호 규칙 검사 가능
  // 예: 대문자, 소문자, 숫자, 특수문자 포함 여부 등

  return { isValid: true };
}

/**
 * 비밀번호 일치 여부 검사 함수
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): { isValid: boolean; message?: string } {
  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  return { isValid: true };
}
