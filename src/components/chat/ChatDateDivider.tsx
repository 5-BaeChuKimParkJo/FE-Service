import { formatChatDateDivider } from '@/utils/date';

export function ChatDateDivider({ date }: { date: Date }) {
  return (
    <div
      className='flex justify-center my-4 select-none'
      role='separator'
      aria-label='날짜 구분선'
    >
      <time
        className='bg-primary-100/15 text-primary-100 text-sm px-4 py-1 rounded-full'
        dateTime={date.toISOString().split('T')[0]}
      >
        <span className='inline-flex items-center gap-1'>
          {formatChatDateDivider(date)}
        </span>
      </time>
    </div>
  );
}
