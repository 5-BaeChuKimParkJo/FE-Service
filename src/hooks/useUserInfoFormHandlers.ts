import { useRef, useCallback, useState } from 'react';

import {
  validateName,
  validateNickname,
  validateEmailFormat,
} from '@/lib/validation.utils';

import { useRegisterStore } from '@/store/use-register-store';
import useDebounce from '@/lib/debounce';
import {
  checkEmailAvailability,
  checkNicknameAvailability,
} from '@/actions/auth-service';

export function useUserInfoFormHandlers() {
  const {
    email,
    setName,
    setNickname,
    setEmail,
    setIsNicknameVerified,
    setIsEmailVerified,
  } = useRegisterStore();

  const [nameError, setNameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const checkNicknameDuplicate = useCallback(
    async (value: string) => {
      if (!value || value.length < 2) return;

      setIsCheckingNickname(true);
      try {
        const isAvailable = await checkNicknameAvailability(value);
        setIsNicknameVerified(isAvailable);
        setNicknameError(isAvailable ? '' : '이미 사용 중인 닉네임입니다.');
      } catch (error) {
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.' + error);
        setIsNicknameVerified(false);
      } finally {
        setIsCheckingNickname(false);
      }
    },
    [setIsNicknameVerified],
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

  const handleVerifyEmail = async () => {
    const emailErrorMsg = validateEmailFormat(email);
    if (emailErrorMsg) {
      setEmailError(emailErrorMsg);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const isAvailable = await checkEmailAvailability(email);
      setIsEmailVerified(isAvailable);
      setEmailError(isAvailable ? '' : '이미 사용 중인 이메일입니다.');
    } catch (error) {
      setEmailError('이메일 중복 확인 중 오류가 발생했습니다.' + error);
      setIsEmailVerified(false);
    } finally {
      setIsCheckingEmail(false);
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
