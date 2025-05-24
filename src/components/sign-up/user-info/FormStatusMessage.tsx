import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface FormStatusMessageProps {
  isVisible: boolean;
  message: string;
}

export function FormStatusMessage({
  isVisible,
  message,
}: FormStatusMessageProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-md'
    >
      <CheckCircle2 className='w-5 h-5 mr-2' />
      <span>{message}</span>
    </motion.div>
  );
}
