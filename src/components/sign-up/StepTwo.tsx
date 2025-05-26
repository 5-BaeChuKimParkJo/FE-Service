'use client';
import { useEffect, useState } from 'react';
import { useRegisterStore } from '@/store/use-register-store';
import { useUserInfoFormHandlers } from '@/hooks/useUserInfoFormHandlers';

import { NameInput } from './user-info/NameInput';
import { NicknameInput } from './user-info/NicknameInput';
import { EmailInput } from './user-info/EmailInput';
import { FormStatusMessage } from './user-info/FormStatusMessage';

export function StepTwo() {
  const {
    name,
    nickname,
    email,
    setStepTwoValid,
    isEmailVerified,
    isNicknameVerified,
  } = useRegisterStore();

  const [allFieldsValid, setAllFieldsValid] = useState(false);

  const {
    nameError,
    nicknameError,
    emailError,
    isCheckingNickname,
    isCheckingEmail,
    handleNameChange,
    handleNicknameChange,
    handleEmailChange,
    handleVerifyEmail,
  } = useUserInfoFormHandlers();

  const isEmailVerifyDisabled =
    !email || emailError !== '' || isCheckingEmail || isEmailVerified;

  useEffect(() => {
    const isValid =
      !!name &&
      !!nickname &&
      !!email &&
      isEmailVerified &&
      isNicknameVerified &&
      nameError === '' &&
      nicknameError === '' &&
      emailError === '';

    setStepTwoValid(isValid);
    setAllFieldsValid(isValid);
  }, [
    name,
    nickname,
    email,
    nameError,
    nicknameError,
    emailError,
    isEmailVerified,
    isNicknameVerified,
    setStepTwoValid,
  ]);

  return (
    <section
      className='flex flex-col h-full'
      aria-labelledby='personal-info-title'
    >
      <div className='flex-1'>
        <div className='space-y-6'>
          <h2 id='personal-info-title' className='sr-only'>
            개인 정보 입력
          </h2>

          <NameInput
            name={name}
            error={nameError}
            onChange={handleNameChange}
          />

          <NicknameInput
            nickname={nickname}
            error={nicknameError}
            isVerified={isNicknameVerified}
            isChecking={isCheckingNickname}
            onChange={handleNicknameChange}
          />

          <EmailInput
            email={email}
            error={emailError}
            isVerified={isEmailVerified}
            isChecking={isCheckingEmail}
            onChange={handleEmailChange}
            onVerify={handleVerifyEmail}
            isVerifyDisabled={isEmailVerifyDisabled}
          />

          <FormStatusMessage
            isVisible={allFieldsValid}
            message='모든 정보가 확인되었습니다. 다음 버튼을 눌러주세요.'
          />
        </div>
      </div>
    </section>
  );
}
