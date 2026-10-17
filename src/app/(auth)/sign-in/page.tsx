import { LoginForm } from '@/components/sign-in/LoginForm';
import { SignupLink } from '@/components/sign-in/SignupLink';
import { DemoSignInButton } from '@/components/sign-in/DemoSignInButton';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <main className='mobile-container px-[1.75rem] min-h-screen flex flex-col'>
      <LoginForm />
      {process.env.DEMO_MEMBER_ID && process.env.DEMO_MEMBER_PASSWORD && (
        <div className='mt-4'>
          <DemoSignInButton label='체험 계정으로 시작하기' />
        </div>
      )}
      <SignupLink />
    </main>
  );
}
