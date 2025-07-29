import Link from 'next/link';
import { Eye, Heart, ChevronRight } from 'lucide-react';

export function MyPageRecentSection() {
  const recentSummary = [
    {
      id: 'recent-products',
      title: '최근본 경매',
      href: '/mypage/recent-auctions',
      icon: <Eye className='w-6 h-6' />,
    },
    {
      id: 'liked-products',
      title: '찜한 상품',
      href: '/mypage/liked-products',
      icon: <Heart className='w-6 h-6' />,
    },
  ];

  return (
    <div className='space-y-4'>
      <h2 className='m-4 text-lg font-bold text-gray-900'>관심 상품</h2>

      <div className='space-y-3'>
        {recentSummary.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className='flex items-center justify-between px-4 py-6 border-b border-gray-300'
          >
            <div className='flex items-center gap-3'>
              <div className='text-gray-600'>{item.icon}</div>
              <h3 className='font-medium text-lg text-gray-900'>
                {item.title}
              </h3>
            </div>

            <div className='flex items-center gap-2'>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
