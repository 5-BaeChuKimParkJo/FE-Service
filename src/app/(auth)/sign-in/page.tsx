'use client';
import { LoginForm } from '@/components/sign-in/LoginForm';
import { SignupLink } from '@/components/sign-in/SignupLink';

export default function SignInPage() {
  return (
    <main className='mobile-container px-[1.75rem] min-h-screen flex flex-col'>
      <LoginForm />
      <SignupLink />
    </main>
  );
}
