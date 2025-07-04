'use client';

import { create } from 'zustand';

type RegisterState = {
  currentStep: number;
  prevStep: number | null;
  userId: string;
  phoneNumber: string;
  verificationCode: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  interests: string[];
  isUserIdVerified: boolean;
  isNicknameVerified: boolean;

  // 각 스텝의 유효성 검사 상태
  stepOneValid: boolean;
  stepTwoValid: boolean;

  // 로딩 상태
  isSubmitting: boolean;

  // 다이얼로그 상태
  showWelcomeDialog: boolean;
  showWhaleTransition: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setUserId: (id: string) => void;
  setPhoneNumber: (phone: string) => void;
  setVerificationCode: (code: string) => void;
  setNickname: (nickname: string) => void;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
  setInterests: (interests: string[]) => void;
  setStepOneValid: (isValid: boolean) => void;
  setStepTwoValid: (isValid: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUserIdVerified: (isVerified: boolean) => void;
  setIsNicknameVerified: (isVerified: boolean) => void;
  setShowWelcomeDialog: (show: boolean) => void;
  setShowWhaleTransition: (show: boolean) => void;
};

export const useRegisterStore = create<RegisterState>((set) => ({
  currentStep: 0,
  prevStep: null,
  userId: '',
  phoneNumber: '',
  verificationCode: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  interests: [],
  isUserIdVerified: false,
  isNicknameVerified: false,

  // 유효성 검사 상태
  stepOneValid: false,
  stepTwoValid: false,

  // 로딩 상태
  isSubmitting: false,

  // 다이얼로그 상태
  showWelcomeDialog: false,
  showWhaleTransition: false,

  // Actions
  setCurrentStep: (step) =>
    set((state) => ({ prevStep: state.currentStep, currentStep: step })),
  setUserId: (id) => set({ userId: id, isUserIdVerified: false }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setVerificationCode: (code) => set({ verificationCode: code }),
  setNickname: (nickname) => set({ nickname, isNicknameVerified: false }),
  setPassword: (password) => set({ password }),
  setPasswordConfirm: (passwordConfirm) => set({ passwordConfirm }),
  setInterests: (interests) => set({ interests }),
  setStepOneValid: (isValid) => set({ stepOneValid: isValid }),
  setStepTwoValid: (isValid) => set({ stepTwoValid: isValid }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsUserIdVerified: (isVerified) => set({ isUserIdVerified: isVerified }),
  setIsNicknameVerified: (isVerified) =>
    set({ isNicknameVerified: isVerified }),
  setShowWelcomeDialog: (show) => set({ showWelcomeDialog: show }),
  setShowWhaleTransition: (show) => set({ showWhaleTransition: show }),
}));
