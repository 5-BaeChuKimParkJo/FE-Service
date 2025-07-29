export function validateName(name: string): string {
  if (!name) return '이름을 입력해주세요.';
  if (name.length < 2) return '이름은 2자 이상이어야 합니다.';
  return '';
}

export function validateNickname(nickname: string): string {
  if (!nickname) return '닉네임을 입력해주세요.';
  if (nickname.length < 2) return '닉네임은 2자 이상이어야 합니다.';
  if (nickname.length > 10) return '닉네임은 10자 이하여야 합니다.';
  return '';
}

export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }

  if (password.length < 8 || password.length > 20) {
    return { isValid: false, message: '비밀번호는 8~20자여야 합니다.' };
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLetter || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      message: '비밀번호는 영문자, 숫자, 특수문자를 모두 포함해야 합니다.',
    };
  }

  return { isValid: true };
}

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

export function validateUserId(userId: string): string {
  if (!userId) return '아이디를 입력해주세요.';

  if (!/^[a-z]/.test(userId)) {
    return '아이디는 소문자로 시작해야 합니다.';
  }

  if (userId.length < 4 || userId.length > 20) {
    return '아이디는 4~20자여야 합니다.';
  }

  if (!/^[a-z][a-z0-9]{3,19}$/.test(userId)) {
    return '아이디는 소문자와 숫자만 사용 가능합니다.';
  }

  return '';
}
