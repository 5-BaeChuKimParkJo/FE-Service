import Link from 'next/link';

export function SignupLink() {
  return (
    <section className='mt-6 text-center'>
      <p className='text-sm text-gray-600'>
        아직 찰낙찰낙 회원이 아니신가요?{' '}
        <Link href='/sign-up' className='text-blue-600 hover:underline'>
          회원가입
        </Link>
      </p>
    </section>
  );
}
