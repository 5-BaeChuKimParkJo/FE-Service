'use client';

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onUpload: (files: FileList) => void;
  className?: string;
  children: React.ReactNode;
  accept?: string;
  multiple?: boolean;
}

export function ImageUploader({
  onUpload,
  className = '',
  children,
  accept = 'image/png,image/jpeg,image/webp,image/bmp',
  multiple = true,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      // 파일 타입 검증
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = [
          'image/png',
          'image/jpeg',
          'image/webp',
          'image/bmp',
        ];
        return validTypes.includes(file.type);
      });

      if (validFiles.length > 0) {
        const fileList = new DataTransfer();
        validFiles.forEach((file) => fileList.items.add(file));
        onUpload(fileList.files);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  return (
    <>
      <div
        className={`${className} ${isDragging ? 'border-purple-500 bg-purple-50' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children}
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className='hidden'
      />
    </>
  );
}
