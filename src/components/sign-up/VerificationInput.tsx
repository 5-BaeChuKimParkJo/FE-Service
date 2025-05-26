import { motion } from 'framer-motion';
import { Input } from '../ui/input';

interface VerificationInputProps {
  verificationCode: string;
  verificationError: string;
  openKeyboard: () => void;
}

export function VerificationInput({
  verificationCode,
  verificationError,
  openKeyboard,
}: VerificationInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        label='인증번호'
        value={verificationCode}
        readOnly
        onClick={openKeyboard}
        error={verificationError}
      />
    </motion.div>
  );
}
