import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EmailInputProps {
  email: string;
  error: string;
  isVerified: boolean;
  isChecking: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  isVerifyDisabled: boolean;
}

export function EmailInput({
  email,
  error,
  isVerified,
  isChecking,
  onChange,
  onVerify,
  isVerifyDisabled,
}: EmailInputProps) {
  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          label='이메일'
          type='email'
          value={email}
          onChange={onChange}
          error={error}
          className='flex-1'
        />
        <Button
          type='button'
          onClick={onVerify}
          disabled={isVerifyDisabled}
          className='self-end h-10 whitespace-nowrap'
        >
          {isChecking ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            '중복 확인'
          )}
        </Button>
      </div>

      {isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center text-green-600 text-sm'
        >
          <CheckCircle2 className='h-4 w-4 mr-1' />
          <span>사용 가능한 이메일입니다.</span>
        </motion.div>
      )}
    </div>
  );
}
