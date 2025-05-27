'use client';

import { useEffect } from 'react';
import { useRegisterStore } from '@/store/use-register-store';
import { usePhoneVerification } from './use-phone-verification';
import { PhoneVerificationForm } from './phone-verification/PhoneVerificationForm';
import { useKeyboard } from '../../hooks/use-keyboard';
import { PhoneVerificationKeyboard } from './phone-verification/PhoneVerificationKeyboard';

export function StepOne() {
  const { phoneNumber, verificationCode, setStepOneValid } = useRegisterStore();

  const {
    isVerificationSent,
    inputMode,
    isKeyboardOpen,
    phoneError,
    verificationError,
    isVerified,
    handleSendVerification,
    handleVerify,
    openKeyboard,
    setIsKeyboardOpen,
  } = usePhoneVerification();

  const verificationErrorMessage = verificationError[0];

  const { handleKeyPress } = useKeyboard({
    inputMode,
    setPhoneError: phoneError[1],
    setVerificationError: verificationError[1],
  });

  useEffect(() => {
    const isValid =
      isVerificationSent === true &&
      typeof verificationCode === 'string' &&
      verificationCode.length === 6 &&
      verificationErrorMessage === '';

    setStepOneValid(isValid);
  }, [
    isVerificationSent,
    verificationCode,
    verificationErrorMessage,
    setStepOneValid,
  ]);

  return (
    <section
      className='flex flex-col h-full'
      aria-labelledby='phone-verification-heading'
    >
      <h2 id='phone-verification-heading' className='sr-only'>
        휴대폰 인증
      </h2>

      <PhoneVerificationForm
        phoneNumber={phoneNumber}
        verificationCode={verificationCode}
        isVerificationSent={isVerificationSent}
        isVerified={isVerified}
        phoneError={phoneError[0]}
        verificationError={verificationError[0]}
        onPhoneInputClick={() => openKeyboard('phone')}
        onVerificationInputClick={() => openKeyboard('verification')}
        onSendVerification={handleSendVerification}
        onVerify={handleVerify}
      />

      <PhoneVerificationKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleKeyPress}
      />
    </section>
  );
}
