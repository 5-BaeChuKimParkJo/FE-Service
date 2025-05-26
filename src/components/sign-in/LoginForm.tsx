'use client';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/sign-up/PhoneInput';
import { NumericKeyboard } from '@/components/ui/numeric-keyboard';
import { useLoginForm } from '@/hooks/useLoginForm';

export function LoginForm() {
  const {
    formData,
    errors,
    isLoading,
    keyboardMode,
    handleChange,
    openKeyboard,
    closeKeyboard,
    handleKeyPress,
    handleSubmit,
  } = useLoginForm();

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
        <PhoneInput
          phoneNumber={formData.phoneNumber}
          phoneError={errors.phoneNumber}
          openKeyboard={openKeyboard}
        />

        <Input
          label='비밀번호'
          name='password'
          type='password'
          autoComplete='current-password'
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
        />

        {errors.general && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
            {errors.general}
          </div>
        )}

        <div className='flex justify-end'>
          <Link
            href='/forgot-password'
            className='text-sm text-blue-600 hover:underline'
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      {keyboardMode !== 'hidden' && (
        <>
          <div
            className='fixed inset-0 bg-black/20 z-40'
            onClick={closeKeyboard}
            aria-hidden='true'
          />
          <div className='fixed inset-x-0 bottom-0 z-50'>
            <NumericKeyboard keypadType='default' onKeyPress={handleKeyPress} />
          </div>
        </>
      )}
    </>
  );
}
