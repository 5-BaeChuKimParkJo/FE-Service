import { useRef, useCallback, useState } from 'react';

import { validateNickname, validateUserId } from '@/lib/validation.utils';

import { useRegisterStore } from '@/store/use-register-store';
import useDebounce from '@/lib/debounce';
import {
  checkNicknameAvailability,
  checkUserIdAvailability,
} from '@/actions/auth-service';

export function useUserInfoForm() {
  const { setUserId, setNickname, setIsNicknameVerified, setIsUserIdVerified } =
    useRegisterStore();

  const [userIdError, setUserIdError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const checkUserIdDuplicate = useCallback(
    async (value: string) => {
      if (!value || value.length < 4) return;

      try {
        setIsCheckingUserId(true);
        const isAvailable = await checkUserIdAvailability(value);

        setIsUserIdVerified(isAvailable);
        setUserIdError(isAvailable ? '' : '이미 사용 중인 아이디입니다.');
      } catch {
        setUserIdError('아이디 확인 중 오류가 발생했습니다.');
        setIsUserIdVerified(false);
      } finally {
        setIsCheckingUserId(false);
      }
    },
    [setIsUserIdVerified],
  );

  const checkNicknameDuplicate = useCallback(
    async (value: string) => {
      if (!value || value.length < 2) return;

      try {
        setIsCheckingNickname(true);
        const isAvailable = await checkNicknameAvailability(value);

        setIsNicknameVerified(isAvailable);
        setNicknameError(isAvailable ? '' : '이미 사용 중인 닉네임입니다.');
      } catch {
        setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
        setIsNicknameVerified(false);
      } finally {
        setIsCheckingNickname(false);
      }
    },
    [setIsNicknameVerified],
  );

  const createDebounce = useDebounce();
  const debouncedCheckUserId = useRef(
    createDebounce((value: string) => checkUserIdDuplicate(value), 1000),
  ).current;
  const debouncedCheckNickname = useRef(
    createDebounce((value: string) => checkNicknameDuplicate(value), 1000),
  ).current;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserId(value);
    setIsUserIdVerified(false);
    const err = validateUserId(value);
    setUserIdError(err);

    if (!err) debouncedCheckUserId(value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setIsNicknameVerified(false);
    const err = validateNickname(value);
    setNicknameError(err);

    if (!err) debouncedCheckNickname(value);
  };

  return {
    userIdError,
    nicknameError,
    isCheckingUserId,
    isCheckingNickname,
    handleUserIdChange,
    handleNicknameChange,
  };
}
