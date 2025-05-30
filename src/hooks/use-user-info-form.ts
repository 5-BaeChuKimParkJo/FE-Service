import { useRef, useState, useMemo } from 'react';

import { useRegisterStore } from '@/store/use-register-store';
import useDebounce from '@/hooks/use-debounce';
import { createUserInfoService } from '@/services/user-info.service';

export function useUserInfoForm() {
  const { setUserId, setNickname, setIsNicknameVerified, setIsUserIdVerified } =
    useRegisterStore();

  const [userIdError, setUserIdError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const userInfoService = useMemo(
    () =>
      createUserInfoService({
        setUserId,
        setNickname,
        setIsNicknameVerified,
        setIsUserIdVerified,
        setUserIdError,
        setNicknameError,
        setIsCheckingUserId,
        setIsCheckingNickname,
      }),
    [setUserId, setNickname, setIsNicknameVerified, setIsUserIdVerified],
  );

  const createDebounce = useDebounce();
  const debouncedCheckUserId = useRef(
    createDebounce(async (value: string) => {
      const result = await userInfoService.validateAndCheckUserId(value);
      setUserIdError(result.error);
    }, 1000),
  ).current;

  const debouncedCheckNickname = useRef(
    createDebounce(async (value: string) => {
      const result = await userInfoService.validateAndCheckNickname(value);
      setNicknameError(result.error);
    }, 1000),
  ).current;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const shouldCheckDuplicate = userInfoService.handleUserIdChange(value);

    if (shouldCheckDuplicate) {
      debouncedCheckUserId(value);
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const shouldCheckDuplicate = userInfoService.handleNicknameChange(value);

    if (shouldCheckDuplicate) {
      debouncedCheckNickname(value);
    }
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
