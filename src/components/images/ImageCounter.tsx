type ImageCounterProps = {
  currentIndex: number;
  totalCount: number;
};

export function ImageCounter({ currentIndex, totalCount }: ImageCounterProps) {
  return (
    <aside className='absolute top-4 right-4 px-3 py-1.5 bg-primary-200/20 backdrop-blur-sm rounded-full text-white text-sm font-medium z-10'>
      <span className='sr-only'>현재 이미지:</span>
      {currentIndex} / {totalCount}
    </aside>
  );
}
