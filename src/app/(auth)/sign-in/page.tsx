import { LoginForm } from '@/components/sign-in/LoginForm';
import { SignupLink } from '@/components/sign-in/SignupLink';
import { DemoSignInOptions } from '@/components/sign-in/DemoSignInOptions';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <main className='mobile-container px-[1.75rem] min-h-screen flex flex-col'>
      <LoginForm />
      <div className='mt-4'>
        <DemoSignInOptions />
      </div>
      <SignupLink />
    </main>
  );
}
