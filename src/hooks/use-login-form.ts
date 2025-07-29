'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/actions/auth-service/sign-in';

export function useLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    id: '',
    password: '',
    general: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showWhaleTransition, setShowWhaleTransition] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      id: '',
      password: '',
      general: '',
    };

    if (!formData.id) {
      newErrors.id = '아이디를 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return !newErrors.id && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signIn(formData.id, formData.password);

      // 로그인 성공 시 고래 애니메이션 표시
      setShowWhaleTransition(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',
      }));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhaleTransitionComplete = () => {
    setShowWhaleTransition(false);
    router.push('/');
  };

  return {
    formData,
    errors,
    isLoading,
    showWhaleTransition,
    handleChange,
    handleSubmit,
    handleWhaleTransitionComplete,
  };
}
