'use client';
import { useEffect, useState } from 'react';

import { useRegisterStore } from '@/store/use-register-store';
import { Input } from '../ui/input';
import {
  validatePassword,
  validatePasswordMatch,
} from '@/lib/validation.utils';

export function StepThree() {
  const {
    password,
    passwordConfirm,
    setPassword,
    setPasswordConfirm,
    setStepThreeValid,
  } = useRegisterStore();
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    const isValid: boolean =
      password.length >= 8 &&
      password === passwordConfirm &&
      passwordError === '' &&
      confirmError === '';
    setStepThreeValid(isValid);
  }, [
    password,
    passwordConfirm,
    passwordError,
    confirmError,
    setStepThreeValid,
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const validation = validatePassword(value);
    if (!validation.isValid) {
      setPasswordError(validation.message || '');
    } else {
      setPasswordError('');
    }

    // 비밀번호 확인 필드가 이미 입력되어 있다면 일치 여부 확인
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

  return (
    <section
      className='flex flex-col h-full'
      aria-labelledby='password-setup-title'
    >
      <div className='flex-1'>
        <div className='space-y-6'>
          <h2 id='password-setup-title' className='sr-only'>
            비밀번호 설정
          </h2>

          <Input
            label='비밀번호'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
          />

          <Input
            label='비밀번호 확인'
            type='password'
            value={passwordConfirm}
            onChange={handleConfirmChange}
            error={confirmError}
          />

          <p className='text-xs text-muted-foreground'>
            8자 이상의 안전한 비밀번호를 입력해주세요.
          </p>
        </div>
      </div>
    </section>
  );
}
