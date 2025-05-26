'use client';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { SignupLink } from '@/components/auth/SignupLink';

export default function SignInPage() {
  return (
    <main className='px-[1.75rem] mx-auto min-h-screen flex flex-col'>
      <LoginHeader />
      <LoginForm />
      <SignupLink />
    </main>
  );
}
