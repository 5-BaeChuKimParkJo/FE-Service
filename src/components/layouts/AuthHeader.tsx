'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import CustomBackIcon from '../icons/CustomBackIcon';
import { useRegisterStore } from '@/stores/use-register-store';

export function AuthHeader() {
  const pathName = usePathname();
  const router = useRouter();

  const { currentStep, setCurrentStep } = useRegisterStore();

  const [headerTitle, setHeaderTitle] = useState('');

  useEffect(() => {
    if (pathName.includes('sign-in')) {
      setHeaderTitle('Sign In');
    } else if (pathName.includes('sign-up')) {
      setHeaderTitle('Sign Up');
    }
  }, [pathName, setHeaderTitle, router]);

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <header className='container mx-auto px-4 py-6'>
      <button onClick={handleBack} aria-label='뒤로 가기'>
        <CustomBackIcon size={44} />
      </button>
      <h1 className='text-4xl font-extrabold text-center mt-4 uppercase'>
        {headerTitle}
      </h1>
    </header>
  );
}
