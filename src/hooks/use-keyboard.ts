'use client';

import { formatPhoneNumber } from '@/lib/phone-utils';
import { useRegisterStore } from '@/store/use-register-store';

interface KeyboardHandlerProps {
  inputMode: 'phone' | 'verification';
  setPhoneError: (error: string) => void;
  setVerificationError: (error: string) => void;
}

export function useKeyboard({
  inputMode,
  setPhoneError,
  setVerificationError,
}: KeyboardHandlerProps) {
  const { phoneNumber, verificationCode, setPhoneNumber, setVerificationCode } =
    useRegisterStore();

  const handleKeyPress = (key: string) => {
    if (key === '010' && inputMode === 'phone' && phoneNumber.length === 0) {
      setPhoneNumber('010-');
      return;
    }

    if (inputMode === 'phone') {
      if (key === 'backspace') {
        setPhoneNumber(phoneNumber.replace(/.$/, '').replace(/-$/, ''));
        setPhoneError('');
      } else if (key === 'clear') {
        setPhoneNumber('');
        setPhoneError('');
      } else if (phoneNumber.replace(/\D/g, '').length < 11) {
        setPhoneNumber(formatPhoneNumber(phoneNumber + key));
        setPhoneError('');
      }
    } else {
      if (key === 'backspace') {
        setVerificationCode(verificationCode.slice(0, -1));
        setVerificationError('');
      } else if (key === 'clear') {
        setVerificationCode('');
        setVerificationError('');
      } else if (verificationCode.length < 6) {
        setVerificationCode(verificationCode + key);
        setVerificationError('');
      }
    }
  };

  return { handleKeyPress };
}
