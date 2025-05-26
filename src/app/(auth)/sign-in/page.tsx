'use client';
import { LoginForm } from '@/components/sign-in/LoginForm';
import { LoginHeader } from '@/components/sign-in/LoginHeader';
import { SignupLink } from '@/components/sign-in/SignupLink';

export default function SignInPage() {
  return (
    <main className='px-[1.75rem] mx-auto min-h-screen flex flex-col'>
      <LoginHeader />
      <LoginForm />
      <SignupLink />
    </main>
  );
}
