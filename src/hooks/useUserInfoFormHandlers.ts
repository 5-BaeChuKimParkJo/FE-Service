import { useRef, useCallback, useState } from 'react';

import {
  validateName,
  validateNickname,
  validateEmailFormat,
} from '@/lib/validation.utils';

import { useRegisterStore } from '@/store/use-register-store';
import useDebounce from '@/lib/debounce';
import {
  useCheckEmailAvailability,
  useCheckNicknameAvailability,
} from '@/actions/auth-service';

export function useUserInfoFormHandlers() {
  const {
    email,
    nickname,
    setName,
    setNickname,
    setEmail,
    setIsNicknameVerified,
    setIsEmailVerified,
  } = useRegisterStore();

  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // TanStack Query 훅 사용
  const {
    isFetching: isCheckingNickname,
    refetch: checkNickname,
    isError: _isNicknameError,
    error: _nicknameQueryError,
    data: _isNicknameAvailable,
  } = useCheckNicknameAvailability(nickname, false);

  const {
    isFetching: isCheckingEmail,
    refetch: checkEmail,
    isError: _isEmailError,
    error: _emailQueryError,
    data: _isEmailAvailable,
  } = useCheckEmailAvailability(email, false);

  // 닉네임 체크 함수 (TanStack Query 사용)
  const checkNicknameDuplicate = useCallback(
    async (value: string) => {
      if (!value || value.length < 2) return;

      try {
        const result = await checkNickname();
        const isAvailable = result.data;

        setIsNicknameVerified(!!isAvailable);
        setNicknameError(isAvailable ? '' : '이미 사용 중인 닉네임입니다.');
      } catch {
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
        setIsNicknameVerified(false);
      }
    },
    [checkNickname, setIsNicknameVerified],
  );

  const createDebounce = useDebounce();
  const debouncedCheckNickname = useRef(
    createDebounce((value: string) => checkNicknameDuplicate(value), 500),
  ).current;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setIsNicknameVerified(false);
    const err = validateNickname(value);
    setNicknameError(err);

    if (!err) debouncedCheckNickname(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmailFormat(value));
  };

  // 이메일 체크 함수 (TanStack Query 사용)
  const handleVerifyEmail = async () => {
    const emailErrorMsg = validateEmailFormat(email);
    if (emailErrorMsg) {
      setEmailError(emailErrorMsg);
      return;
    }

    try {
      const result = await checkEmail();
      const isAvailable = result.data;

      setIsEmailVerified(!!isAvailable);
      setEmailError(isAvailable ? '' : '이미 사용 중인 이메일입니다.');
    } catch {
      setEmailError('이메일 중복 확인 중 오류가 발생했습니다.');
      setIsEmailVerified(false);
    }
  };

  return {
    nameError,
    nicknameError,
    emailError,
    isCheckingNickname,
    isCheckingEmail,
    handleNameChange,
    handleNicknameChange,
    handleEmailChange,
    handleVerifyEmail,
  };
}
