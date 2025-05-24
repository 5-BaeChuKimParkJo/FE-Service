'use client';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { SkipBackIcon as Backspace, X } from 'lucide-react';

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  keypadType?: 'default' | 'pin';
  activeKeys?: string[];
  className?: string;
  buttonClassName?: string;
  disableAnimation?: boolean;
}

export function NumericKeyboard({
  onKeyPress,
  keypadType = 'pin',
  activeKeys = [],
  className,
  buttonClassName,
  disableAnimation = false,
}: NumericKeyboardProps) {
  const keys =
    keypadType === 'default'
      ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '010', '0', 'backspace']
      : [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          'clear',
          '0',
          'backspace',
        ];

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
  };

  const renderKeyContent = (key: string) => {
    if (key === 'backspace') return <Backspace className='h-5 w-5' />;
    if (key === 'clear') return <X className='h-5 w-5' />;
    return key;
  };

  return (
    <motion.div
      className={cn('grid grid-cols-3 gap-2 rounded-lg bg-white ', className)}
      {...(disableAnimation
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
          })}
    >
      {keys.map((key) => (
        <motion.button
          key={key}
          type='button'
          className={cn(
            'flex h-14 items-center justify-center rounded-md bg-white text-lg font-medium transition-colors hover:bg-gray-100 active:bg-primary/20',
            activeKeys.includes(key) && 'bg-gray-100',
            buttonClassName,
          )}
          onClick={() => handleKeyPress(key)}
          whileTap={{ scale: 0.95 }}
        >
          {renderKeyContent(key)}
        </motion.button>
      ))}
    </motion.div>
  );
}
