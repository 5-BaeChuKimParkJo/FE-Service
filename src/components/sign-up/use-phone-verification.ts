import { useState, useCallback } from 'react';
import { sendCode } from '@/actions/auth-service/sendCode';
import { verifyCode } from '@/actions/auth-service/verifyCode';
import { useRegisterStore } from '@/store/use-register-store';
import { isValidPhoneNumber, isValidVerificationCode } from '@/lib/phone-utils';

export function usePhoneVerification() {
  const { phoneNumber, verificationCode, setCurrentStep } = useRegisterStore();

  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [inputMode, setInputMode] = useState<'phone' | 'verification'>('phone');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [verificationErrorMessage, setVerificationErrorMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const phoneError = [phoneErrorMessage, setPhoneErrorMessage] as const;
  const verificationError = [
    verificationErrorMessage,
    setVerificationErrorMessage,
  ] as const;

  const handleSendVerification = useCallback(async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneErrorMessage('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      await sendCode(phoneNumber);
      setIsVerificationSent(true);
      setInputMode('verification');
      setPhoneErrorMessage('');
    } catch (error) {
      console.error('인증번호 전송 실패:', error);
      setPhoneErrorMessage('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    }
  }, [phoneNumber]);

  const handleVerify = useCallback(async () => {
    if (!isValidVerificationCode(verificationCode)) {
      setVerificationErrorMessage('인증번호 6자리를 입력해주세요.');
      return;
    }

    setIsVerifying(true);
    setVerificationErrorMessage('');

    try {
      const isValid = await verifyCode(phoneNumber, verificationCode);

      if (isValid) {
        setIsVerified(true);
        setVerificationErrorMessage('');

        // 인증 성공 후 잠시 대기 후 다음 단계로 이동
        setTimeout(() => {
          setCurrentStep(1); // 다음 단계(Step Two)로 이동
        }, 500);
      } else {
        setVerificationErrorMessage('인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증번호 검증 실패:', error);
      setVerificationErrorMessage(
        '인증번호 검증에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsVerifying(false);
    }
  }, [phoneNumber, verificationCode, setCurrentStep]);

  const openKeyboard = useCallback((mode: 'phone' | 'verification') => {
    setInputMode(mode);
  }, []);

  return {
    isVerificationSent,
    inputMode,
    phoneError,
    verificationError,
    isVerified,
    isVerifying,
    handleSendVerification,
    handleVerify,
    openKeyboard,
  };
}
