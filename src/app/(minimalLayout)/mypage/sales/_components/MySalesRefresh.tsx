import { RefreshCw } from 'lucide-react';
import { mySalesUrl } from '@/libs/mySales';
import type { MySalesQuery } from '@/types/auction/my-sales';

export function MySalesRefresh({ query }: { query: MySalesQuery }) {
  return (
    <a
      href={mySalesUrl(query, query.page)}
      className='inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm text-gray-600'
    >
      <RefreshCw aria-hidden='true' className='h-4 w-4' />
      새로고침
    </a>
  );
}
