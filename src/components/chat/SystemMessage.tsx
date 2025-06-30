import React from 'react';

interface SystemMessageProps {
  message: string;
}

export const SystemMessage = ({ message }: SystemMessageProps) => {
  return (
    <div className='py-2 text-center'>
      <p className='text-sm text-gray-500'>{message}</p>
    </div>
  );
};
