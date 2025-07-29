import { CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { FilledInput } from '@/components/ui/filled-input';

interface UserIdInputProps {
  userId: string;
  error: string;
  isVerified: boolean;
  isChecking: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserIdInput({
  userId,
  error,
  isVerified,
  isChecking,
  onChange,
}: UserIdInputProps) {
  return (
    <div className='space-y-2'>
      <FilledInput
        label='아이디'
        value={userId}
        onChange={onChange}
        error={error}
      />

      {isChecking && (
        <div className='flex items-center text-muted-foreground text-sm'>
          <Loader2 className='h-3 w-3 animate-spin mr-1' />
          <span>아이디 확인 중...</span>
        </div>
      )}

      {isVerified && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center text-green-600 text-sm'
        >
          <CheckCircle2 className='h-4 w-4 mr-1' />
          <span>사용 가능한 아이디입니다.</span>
        </motion.div>
      )}
    </div>
  );
}
