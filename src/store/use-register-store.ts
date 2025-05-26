'use client';

import { create } from 'zustand';

type RegisterState = {
  currentStep: number;
  prevStep: number | null;
  phoneNumber: string;
  verificationCode: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  interests: string[];
  isEmailVerified: boolean;
  isNicknameVerified: boolean;

  // 각 스텝의 유효성 검사 상태
  stepOneValid: boolean;
  stepTwoValid: boolean;
  stepThreeValid: boolean;

  // 로딩 상태
  isSubmitting: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setPhoneNumber: (phone: string) => void;
  setVerificationCode: (code: string) => void;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setInterests: (interests: string[]) => void;
  setStepOneValid: (isValid: boolean) => void;
  setStepTwoValid: (isValid: boolean) => void;
  setStepThreeValid: (isValid: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  setIsNicknameVerified: (isVerified: boolean) => void;
};

export const useRegisterStore = create<RegisterState>((set) => ({
  currentStep: 0,
  prevStep: null,
  phoneNumber: '',
  verificationCode: '',
  name: '',
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  interests: [],
  isEmailVerified: false,
  isNicknameVerified: false,

  // 유효성 검사 상태
  stepOneValid: false,
  stepTwoValid: false,
  stepThreeValid: false,

  // 로딩 상태
  isSubmitting: false,

  // Actions
  setCurrentStep: (step) =>
    set((state) => ({ prevStep: state.currentStep, currentStep: step })),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setVerificationCode: (code) => set({ verificationCode: code }),
  setName: (name) => set({ name }),
  setNickname: (nickname) => set({ nickname, isNicknameVerified: false }),
  setEmail: (email) => set({ email, isEmailVerified: false }),
  setPassword: (password) => set({ password }),
  setPasswordConfirm: (passwordConfirm) => set({ passwordConfirm }),
  setInterests: (interests) => set({ interests }),
  setStepOneValid: (isValid) => set({ stepOneValid: isValid }),
  setStepTwoValid: (isValid) => set({ stepTwoValid: isValid }),
  setStepThreeValid: (isValid) => set({ stepThreeValid: isValid }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsEmailVerified: (isVerified) => set({ isEmailVerified: isVerified }),
  setIsNicknameVerified: (isVerified) =>
    set({ isNicknameVerified: isVerified }),
}));
