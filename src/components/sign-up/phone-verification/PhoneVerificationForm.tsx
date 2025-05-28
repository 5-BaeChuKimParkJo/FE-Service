'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../../ui/input';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhoneVerificationFormProps {
  phoneNumber: string;
  verificationCode: string;
  isVerificationSent: boolean;
  isVerified?: boolean;
  phoneError: string;
  verificationError: string;
  onPhoneInputClick: () => void;
  onVerificationInputClick: () => void;
  onSendVerification: () => void;
  onVerify: () => void;
}

/**
 * 휴대폰 인증 폼 컴포넌트
 */
export const PhoneVerificationForm = memo(function PhoneVerificationForm({
  phoneNumber,
  verificationCode,
  isVerificationSent,
  isVerified = false,
  phoneError,
  verificationError,
  onPhoneInputClick,
  onVerificationInputClick,
  onSendVerification,
  onVerify,
}: PhoneVerificationFormProps) {
  return (
    <div className='flex-1'>
      <div className='space-y-6'>
        <Input
          label='휴대폰 번호'
          value={phoneNumber}
          readOnly
          onClick={onPhoneInputClick}
          error={phoneError}
        />

        {isVerificationSent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              label='인증번호'
              value={verificationCode}
              readOnly
              onClick={onVerificationInputClick}
              error={verificationError}
            />
          </motion.div>
        )}

        {isVerified ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-md'
          >
            <CheckCircle2 className='w-5 h-5 mr-2' />
            <span>인증이 완료되었습니다. 다음 단계로 이동합니다.</span>
          </motion.div>
        ) : (
          <VerificationButton
            isVerificationSent={isVerificationSent}
            phoneNumber={phoneNumber}
            verificationCode={verificationCode}
            onSendVerification={onSendVerification}
            onVerify={onVerify}
          />
        )}
      </div>
    </div>
  );
});

interface VerificationButtonProps {
  isVerificationSent: boolean;
  phoneNumber: string;
  verificationCode: string;
  onSendVerification: () => void;
  onVerify: () => void;
}

const VerificationButton = memo(function VerificationButton({
  isVerificationSent,
  phoneNumber,
  verificationCode,
  onSendVerification,
  onVerify,
}: VerificationButtonProps) {
  if (!isVerificationSent) {
    return (
      <Button
        label='인증번호 발송'
        width='full'
        onClick={onSendVerification}
        disabled={!phoneNumber}
      />
    );
  }

  return (
    <button onClick={onVerify} disabled={!verificationCode}>
      인증 확인
    </button>
  );
});
