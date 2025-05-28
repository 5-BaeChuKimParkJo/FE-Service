import Link from 'next/link';

export function SignupLink() {
  return (
    <section className='mt-6 text-center'>
      <p className='text-sm text-gray-600'>
        계정을 아직 가지고 있지 않으세요?
        <Link href='/sign-up' className='text-gray-900 font-black ml-2'>
          회원가입
        </Link>
      </p>
    </section>
  );
}
