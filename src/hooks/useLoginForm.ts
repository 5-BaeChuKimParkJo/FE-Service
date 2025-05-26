'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPhoneNumber } from '@/lib/phone-utils';

export function useLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    phoneNumber: '',
    password: '',
    general: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'phone' | 'hidden'>(
    'hidden',
  );
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 입력 시 에러 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const openKeyboard = () => {
    setKeyboardMode('phone');
    setShowKeyboard(true);
  };

  const closeKeyboard = () => {
    setKeyboardMode('hidden');
    setShowKeyboard(false);
  };

  const handleKeyPress = (key: string) => {
    if (key === '010' && formData.phoneNumber.length === 0) {
      setFormData((prev) => ({ ...prev, phoneNumber: '010-' }));
      return;
    }

    if (key === 'backspace') {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: prev.phoneNumber.replace(/.$/, '').replace(/-$/, ''),
      }));
      if (errors.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
      }
    } else if (key === 'clear') {
      setFormData((prev) => ({ ...prev, phoneNumber: '' }));
      if (errors.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
      }
    } else if (formData.phoneNumber.replace(/\D/g, '').length < 11) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: formatPhoneNumber(prev.phoneNumber + key),
      }));
      if (errors.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      phoneNumber: '',
      password: '',
      general: '',
    };

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = '휴대폰 번호를 입력해주세요.';
    } else if (
      !/^01[016789]\d{7,8}$/.test(formData.phoneNumber.replace(/-/g, ''))
    ) {
      newErrors.phoneNumber = '유효한 휴대폰 번호가 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return !newErrors.phoneNumber && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 여기서는 실제 로그인 로직 없이 UI만 구현
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 상태 보여주기 위한 지연

      // 로그인 성공 시 홈페이지로 리다이렉트
      router.push('/');
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    keyboardMode,
    showKeyboard,
    handleChange,
    openKeyboard,
    closeKeyboard,
    handleKeyPress,
    handleSubmit,
  };
}
