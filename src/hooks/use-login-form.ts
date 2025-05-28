'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      newErrors.id = '휴대폰 번호를 입력해주세요.';
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
    handleChange,
    handleSubmit,
  };
}
