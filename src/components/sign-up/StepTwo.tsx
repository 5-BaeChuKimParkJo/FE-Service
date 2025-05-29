'use client';
import { useEffect, useState } from 'react';

import { useRegisterStore } from '@/store/use-register-store';
import { useUserInfoForm } from '@/hooks/use-user-info-form';
import { NicknameInput } from './user-info/NicknameInput';
import { UserIdInput } from './user-info/UserIdInput';
import { FormStatusMessage } from './user-info/FormStatusMessage';
import {
  validatePassword,
  validatePasswordMatch,
} from '@/lib/validation.utils';
import { FilledInput } from '../ui/filled-input';

export function StepTwo() {
  const {
    userId,
    nickname,
    password,
    passwordConfirm,
    setPassword,
    setPasswordConfirm,
    setStepTwoValid,
    isUserIdVerified,
    isNicknameVerified,
  } = useRegisterStore();

  const [allFieldsValid, setAllFieldsValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const {
    userIdError,
    nicknameError,
    isCheckingUserId,
    isCheckingNickname,
    handleUserIdChange,
    handleNicknameChange,
  } = useUserInfoForm();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const validation = validatePassword(value);
    if (!validation.isValid) {
      setPasswordError(validation.message || '');
    } else {
      setPasswordError('');
    }

    if (passwordConfirm) {
      const matchValidation = validatePasswordMatch(value, passwordConfirm);
      if (!matchValidation.isValid) {
        setConfirmError(matchValidation.message || '');
      } else {
        setConfirmError('');
      }
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    const validation = validatePasswordMatch(password, value);
    if (!validation.isValid) {
      setConfirmError(validation.message || '');
    } else {
      setConfirmError('');
    }
  };

  useEffect(() => {
    const isValid =
      !!userId &&
      !!nickname &&
      !!password &&
      !!passwordConfirm &&
      isUserIdVerified &&
      isNicknameVerified &&
      userIdError === '' &&
      nicknameError === '' &&
      passwordError === '' &&
      confirmError === '';

    setStepTwoValid(isValid);
    setAllFieldsValid(isValid);
  }, [
    userId,
    nickname,
    password,
    passwordConfirm,
    userIdError,
    nicknameError,
    passwordError,
    confirmError,
    isUserIdVerified,
    isNicknameVerified,
    setStepTwoValid,
  ]);

  return (
    <section
      className='flex flex-col h-full'
      aria-labelledby='account-info-title'
    >
      <div className='flex-1'>
        <div className='space-y-6'>
          <h2 id='account-info-title' className='sr-only'>
            계정 정보 입력
          </h2>

          <UserIdInput
            userId={userId}
            error={userIdError}
            isVerified={isUserIdVerified}
            isChecking={isCheckingUserId}
            onChange={handleUserIdChange}
          />

          <NicknameInput
            nickname={nickname}
            error={nicknameError}
            isVerified={isNicknameVerified}
            isChecking={isCheckingNickname}
            onChange={handleNicknameChange}
          />

          <FilledInput
            label='비밀번호'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
          />

          <FilledInput
            label='비밀번호 확인'
            type='password'
            value={passwordConfirm}
            onChange={handleConfirmChange}
            error={confirmError}
          />

          <p className='text-xs text-muted-foreground'>
            8자 이상의 안전한 비밀번호를 입력해주세요.
          </p>

          <FormStatusMessage
            isVisible={allFieldsValid}
            message='모든 정보가 확인되었습니다. 다음 버튼을 눌러주세요.'
          />
        </div>
      </div>
    </section>
  );
}
