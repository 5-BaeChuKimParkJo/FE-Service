'use client';

import { memo } from 'react';
import { NumericKeyboard } from '../../ui/numeric-keyboard';
import { BottomSheet } from '../../ui/bottom-sheet';

interface PhoneVerificationKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyPress: (key: string) => void;
}

export const PhoneVerificationKeyboard = memo(
  function PhoneVerificationKeyboard({
    isOpen,
    onClose,
    onKeyPress,
  }: PhoneVerificationKeyboardProps) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={false}
        height='auto'
      >
        <div className='pt-0 pb-4'>
          <NumericKeyboard onKeyPress={onKeyPress} className='mb-4' />
          <button
            className='w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
            onClick={onClose}
          >
            완료
          </button>
        </div>
      </BottomSheet>
    );
  },
);
