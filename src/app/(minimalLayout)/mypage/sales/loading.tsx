import { MySalesContentSkeleton } from './_components/MySalesContentSkeleton';
export default function Loading() {
  return (
    <div className='p-4' role='status' aria-label='내 경매 불러오는 중'>
      <MySalesContentSkeleton />
    </div>
  );
}
