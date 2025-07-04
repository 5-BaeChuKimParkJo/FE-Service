import React from 'react';
import Image from 'next/image';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, imageUrl }) => {
  if (!open) return null;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'
      onClick={onClose}
    >
      <div
        className='relative max-w-full max-h-full'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-2 right-2 mb-5 text-white bg-opacity-80 rounded-full  hover:bg-opacity-100'
        >
          <span className='text-xl'>✕</span>
        </button>
        <Image
          src={imageUrl}
          alt='확대 이미지'
          width={600}
          height={600}
          className='object-contain max-w-[90vw] max-h-[80vh] rounded-lg'
        />
      </div>
    </div>
  );
};

export default ImageModal;
