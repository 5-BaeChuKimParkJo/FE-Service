import { Upload } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface UploadButtonProps {
  onUpload: (files: FileList) => Promise<void>;
  currentCount: number;
  maxCount: number;
}

export function UploadButton({
  onUpload,
  currentCount,
  maxCount,
}: UploadButtonProps) {
  if (currentCount >= maxCount) return null;

  return (
    <div className='flex-shrink-0'>
      <ImageUploader
        onUpload={onUpload}
        className='w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-100 hover:bg-blue-50 active:bg-blue-100 transition-colors  touch-manipulation select-none'
      >
        <Upload className='w-5 h-5 text-gray-400 mb-1' />
        <p className='text-xs text-gray-500 text-center font-medium'>추가</p>
        <p className='text-xs text-gray-400'>
          {currentCount}/{maxCount}
        </p>
      </ImageUploader>
    </div>
  );
}
