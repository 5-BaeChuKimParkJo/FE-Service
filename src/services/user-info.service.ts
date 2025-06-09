import { validateNickname, validateUserId } from '@/libs/validation.utils';
import {
  checkNicknameAvailability,
  checkUserIdAvailability,
} from '@/actions/auth-service';

export interface UserInfoServiceDependencies {
  setUserId: (userId: string) => void;
  setNickname: (nickname: string) => void;
  setIsNicknameVerified: (verified: boolean) => void;
  setIsUserIdVerified: (verified: boolean) => void;
  setUserIdError: (error: string) => void;
  setNicknameError: (error: string) => void;
  setIsCheckingUserId: (checking: boolean) => void;
  setIsCheckingNickname: (checking: boolean) => void;
}

export class UserInfoService {
  constructor(private deps: UserInfoServiceDependencies) {}

  async validateAndCheckUserId(
    userId: string,
  ): Promise<{ isValid: boolean; error: string }> {
    // 기본 유효성 검사
    const validationError = validateUserId(userId);
    if (validationError) {
      this.deps.setIsUserIdVerified(false);
      return { isValid: false, error: validationError };
    }

    // 길이 체크
    if (userId.length < 4) {
      this.deps.setIsUserIdVerified(false);
      return { isValid: true, error: '' }; // 에러는 없지만 중복 체크는 안 함
    }

    // 중복 체크
    try {
      this.deps.setIsCheckingUserId(true);
      const isAvailable = await checkUserIdAvailability(userId);

      this.deps.setIsUserIdVerified(isAvailable);
      const error = isAvailable ? '' : '이미 사용 중인 아이디입니다.';

      return { isValid: isAvailable, error };
    } catch (error) {
      console.error('UserId availability check failed:', error);
      this.deps.setIsUserIdVerified(false);
      const errorMessage = '아이디 확인 중 오류가 발생했습니다.';

      return { isValid: false, error: errorMessage };
    } finally {
      this.deps.setIsCheckingUserId(false);
    }
  }

  async validateAndCheckNickname(
    nickname: string,
  ): Promise<{ isValid: boolean; error: string }> {
    // 기본 유효성 검사
    const validationError = validateNickname(nickname);
    if (validationError) {
      this.deps.setIsNicknameVerified(false);
      return { isValid: false, error: validationError };
    }

    // 길이 체크
    if (nickname.length < 2) {
      this.deps.setIsNicknameVerified(false);
      return { isValid: true, error: '' }; // 에러는 없지만 중복 체크는 안 함
    }

    // 중복 체크
    try {
      this.deps.setIsCheckingNickname(true);
      const isAvailable = await checkNicknameAvailability(nickname);

      this.deps.setIsNicknameVerified(isAvailable);
      const error = isAvailable ? '' : '이미 사용 중인 닉네임입니다.';

      return { isValid: isAvailable, error };
    } catch (error) {
      console.error('Nickname availability check failed:', error);
      this.deps.setIsNicknameVerified(false);
      const errorMessage = '닉네임 확인 중 오류가 발생했습니다.';

      return { isValid: false, error: errorMessage };
    } finally {
      this.deps.setIsCheckingNickname(false);
    }
  }

  handleUserIdChange(userId: string) {
    this.deps.setUserId(userId);
    this.deps.setIsUserIdVerified(false);

    const validationError = validateUserId(userId);
    this.deps.setUserIdError(validationError);

    return !validationError && userId.length >= 4;
  }

  handleNicknameChange(nickname: string) {
    this.deps.setNickname(nickname);
    this.deps.setIsNicknameVerified(false);

    const validationError = validateNickname(nickname);
    this.deps.setNicknameError(validationError);

    return !validationError && nickname.length >= 2;
  }
}

// 팩토리 함수
export function createUserInfoService(deps: UserInfoServiceDependencies) {
  return new UserInfoService(deps);
}
