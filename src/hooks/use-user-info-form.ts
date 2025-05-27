import { useRef, useCallback, useState } from 'react';

import { validateNickname, validateUserId } from '@/lib/validation.utils';

import { useRegisterStore } from '@/store/use-register-store';
import useDebounce from '@/lib/debounce';
import {
  useCheckNicknameAvailability,
  useCheckUserIdAvailability,
} from '@/actions/auth-service';

export function useUserInfoForm() {
  const {
    userId,
    nickname,
    setUserId,
    setNickname,
    setIsNicknameVerified,
    setIsUserIdVerified,
  } = useRegisterStore();

  const [userIdError, setUserIdError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // TanStack Query 훅 사용
  const {
    isFetching: isCheckingUserId,
    refetch: checkUserId,
    data: _isUserIdAvailable,
  } = useCheckUserIdAvailability(userId, false);

  const {
    isFetching: isCheckingNickname,
    refetch: checkNickname,
    isError: _isNicknameError,
    error: _nicknameQueryError,
    data: _isNicknameAvailable,
  } = useCheckNicknameAvailability(nickname, false);

  // 아이디 체크 함수
  const checkUserIdDuplicate = useCallback(
    async (value: string) => {
      if (!value || value.length < 4) return;

      try {
        const result = await checkUserId();
        const isAvailable = result.data;

        setIsUserIdVerified(!!isAvailable);
        setUserIdError(isAvailable ? '' : '이미 사용 중인 아이디입니다.');
      } catch {
        setUserIdError('아이디 확인 중 오류가 발생했습니다.');
        setIsUserIdVerified(false);
      }
    },
    [checkUserId, setIsUserIdVerified],
  );

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
  const debouncedCheckUserId = useRef(
    createDebounce((value: string) => checkUserIdDuplicate(value), 500),
  ).current;
  const debouncedCheckNickname = useRef(
    createDebounce((value: string) => checkNicknameDuplicate(value), 500),
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
