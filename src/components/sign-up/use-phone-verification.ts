import { useState, useCallback } from 'react';
import { useRegisterStore } from '@/store/use-register-store';
import { isValidPhoneNumber, isValidVerificationCode } from '@/lib/phone-utils';

export function usePhoneVerification() {
  const { phoneNumber, verificationCode, setCurrentStep } = useRegisterStore();

  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [inputMode, setInputMode] = useState<'phone' | 'verification'>('phone');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [verificationErrorMessage, setVerificationErrorMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const phoneError = [phoneErrorMessage, setPhoneErrorMessage] as const;
  const verificationError = [
    verificationErrorMessage,
    setVerificationErrorMessage,
  ] as const;

  const handleSendVerification = useCallback(() => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneErrorMessage('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setIsVerificationSent(true);
    setInputMode('verification');
    setIsKeyboardOpen(true);
  }, [phoneNumber]);

  const handleVerify = useCallback(() => {
    if (!isValidVerificationCode(verificationCode)) {
      setVerificationErrorMessage('인증번호 6자리를 입력해주세요.');
      return;
    }

    setVerificationErrorMessage('');
    setIsVerified(true);
    setIsKeyboardOpen(false);

    // 인증 성공 후 잠시 대기 후 다음 단계로 이동
    setTimeout(() => {
      setCurrentStep(1); // 다음 단계(Step Two)로 이동
    }, 500);
  }, [verificationCode, setCurrentStep]);

  const openKeyboard = useCallback((mode: 'phone' | 'verification') => {
    setInputMode(mode);
    setIsKeyboardOpen(true);
  }, []);

  return {
    isVerificationSent,
    inputMode,
    isKeyboardOpen,
    phoneError,
    verificationError,
    isVerified,
    handleSendVerification,
    handleVerify,
    openKeyboard,
    setIsKeyboardOpen: useCallback((value: boolean) => {
      setIsKeyboardOpen(value);
    }, []),
  };
}
