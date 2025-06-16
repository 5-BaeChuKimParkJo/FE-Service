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
      const response = await signIn(formData.id, formData.password);

      // 쿠키에 토큰 저장
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=3600; secure; samesite=strict`;
      document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=1209600; secure; samesite=strict`;

      router.push('/');
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

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
}
