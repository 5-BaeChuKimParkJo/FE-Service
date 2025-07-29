import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

import { FilledInput } from '@/components/ui/filled-input';

interface NicknameInputProps {
  nickname: string;
  error: string;
  isVerified: boolean;
  isChecking: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NicknameInput({
  nickname,
  error,
  isVerified,
  isChecking,
  onChange,
}: NicknameInputProps) {
  return (
    <div className='space-y-2'>
      <FilledInput
        label='닉네임'
        value={nickname}
        onChange={onChange}
        error={error}
      />

      {isChecking && (
        <div className='flex items-center text-muted-foreground text-sm'>
          <Loader2 className='h-3 w-3 animate-spin mr-1' />
          <span>닉네임 확인 중...</span>
        </div>
      )}

      {isVerified && !isChecking && nickname.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center text-green-600 text-sm'
        >
          <CheckCircle2 className='h-4 w-4 mr-1' />
          <span>사용 가능한 닉네임입니다.</span>
        </motion.div>
      )}

      {error && !isChecking && nickname && nickname.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center text-destructive text-sm'
        >
          <AlertCircle className='h-4 w-4 mr-1' />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}
