'use client';
import { RegisterStepper } from '@/components/sign-up/RegisterStepper';
import { SignUpHeader } from '@/components/sign-up/SignUpHeader';
import { SignUpButtons } from '@/components/sign-up/SignUpButtons';
import { AnimatedStepContainer } from '@/components/sign-up/AnimatedStepContainer';
import { SignUpDialogs } from '@/components/sign-up/SignUpDialogs';

export function SignUpForm() {
  return (
    <>
      <main className='container max-w-md mx-auto py-8 px-4 min-h-[100dvh] flex flex-col relative'>
        <SignUpHeader />

        <nav aria-label='회원가입 진행 단계' className='ml-2 mr-2 mb-6'>
          <RegisterStepper />
        </nav>

        <AnimatedStepContainer />

        <SignUpButtons />
      </main>

      <SignUpDialogs />
    </>
  );
}
