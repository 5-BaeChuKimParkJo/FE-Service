'use client';

interface LikeButtonWrapperProps {
  auctionUuid: string;
}

export function LikeButtonWrapper({ auctionUuid }: LikeButtonWrapperProps) {
  const handleLike = () => {
    console.log('좋아요:', auctionUuid);
  };

  return (
    <button
      onClick={handleLike}
      className='absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5 text-gray-600'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
        />
      </svg>
    </button>
  );
}
