/**
 * 전화번호 형식을 포맷팅하는 함수
 * 입력: 01012345678
 * 출력: 010-1234-5678
 */
export function formatPhoneNumber(value: string): string {
  // 숫자가 아닌 문자 제거
  const numbers = value.replace(/\D/g, '');

  // 010-0000-0000 형식으로 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
}

/**
 * 전화번호 유효성 검사 함수
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const numbers = phoneNumber.replace(/\D/g, '');
  return numbers.length === 11 && numbers.startsWith('010');
}

/**
 * 인증번호 유효성 검사 함수
 */
export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}
