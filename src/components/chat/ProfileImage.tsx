import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src: string;
  alt?: string;
  size?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = '',
  size = 40,
}) => {
  return (
    <div
      className='flex-shrink-0 rounded-full overflow-hidden bg-gray-200'
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className='object-cover w-full h-full'
      />
    </div>
  );
};

export default ProfileImage;
