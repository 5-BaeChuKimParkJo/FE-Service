'use client';

import { useEffect } from 'react';
import { useRegisterStore } from '@/store/use-register-store';
import { usePhoneVerification } from './use-phone-verification';
import { PhoneVerificationForm } from './phone-verification/PhoneVerificationForm';

export function StepOne() {
  const {
    phoneNumber,
    verificationCode,
    setStepOneValid,
    setPhoneNumber,
    setVerificationCode,
  } = useRegisterStore();

  const {
    isVerificationSent,
    phoneError,
    verificationError,
    isVerified,
    isVerifying,
    handleSendVerification,
    handleVerify,
  } = usePhoneVerification();

  const verificationErrorMessage = verificationError[0];

  useEffect(() => {
    const isValid = isVerified === true && verificationErrorMessage === '';

    setStepOneValid(isValid);
  }, [isVerified, verificationErrorMessage, setStepOneValid]);

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
        isVerifying={isVerifying}
        phoneError={phoneError[0]}
        verificationError={verificationError[0]}
        onPhoneChange={setPhoneNumber}
        onVerificationCodeChange={setVerificationCode}
        onSendVerification={handleSendVerification}
        onVerify={handleVerify}
      />
    </section>
  );
}
