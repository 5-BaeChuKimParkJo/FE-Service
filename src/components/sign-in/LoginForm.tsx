'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/hooks/use-login-form';
import { FilledInput } from '../ui/filled-input';

export function LoginForm() {
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
        <FilledInput
          label='your id'
          name='id'
          type='text'
          value={formData.id}
          onChange={handleChange}
          disabled={isLoading}
        />

        <FilledInput
          label='password'
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
            className='text-sm text-gray-600 hover:underline'
          >
            Forget Password
          </Link>
        </div>

        <Button
          type='submit'
          width='full'
          className='w-full'
          size='xl'
          disabled={isLoading}
        >
          {isLoading ? 'Loading' : 'SIGN IN'}
        </Button>
      </form>
    </>
  );
}
