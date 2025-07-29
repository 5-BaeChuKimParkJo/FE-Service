import Image from 'next/image';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { formatNumber } from '@/utils/format';
import { ChatroomInfoResponse } from '@/types/chat';
import { MemberSummary } from '@/types/member';
import { getChatRoomHeaderData } from '@/utils/chat-room-header';
import { ReviewButton } from './ReviewButton';

export async function ChatRoomHeader({
  chatroomInfo,
  opponentInfo,
  currentUserUuid,
}: {
  chatroomInfo: ChatroomInfoResponse;
  opponentInfo: MemberSummary;
  currentUserUuid: string;
}) {
  const { href, product, price, imageUrl, status, sellerInfo } =
    await getChatRoomHeaderData(chatroomInfo);

  return (
    <header className='sticky top-0 z-10 bg-white shadow-sm'>
      <div className='flex h-16 items-center justify-between border-b px-4'>
        <div className='flex items-center gap-2'>
          <Link href='/chat' passHref>
            <button aria-label='뒤로가기' className='p-2'>
              <ChevronLeft className='h-6 w-6' />
            </button>
          </Link>
          <h2 className='text-lg font-bold'>{opponentInfo.nickname}</h2>
        </div>
        <div className='flex items-center gap-1'>
          <ReviewButton
            currentUserUuid={currentUserUuid}
            opponentInfo={opponentInfo}
            productInfo={{
              uuid: chatroomInfo.postUuid,
              title: product.title,
              sellerUuid: sellerInfo.memberUuid,
              type:
                chatroomInfo.chatRoomType === 'NORMAL_PRIVATE'
                  ? 'PRODUCT'
                  : 'AUCTION',
              imageUrl,
              price,
              status,
            }}
          />
          <button aria-label='더보기' className='p-2'>
            <MoreVertical className='h-5 w-5' />
          </button>
        </div>
      </div>

      <section aria-labelledby='product-info-heading'>
        <h2 id='product-info-heading' className='sr-only'>
          거래 상품 정보
        </h2>
        <Link
          href={href}
          className='flex items-center gap-4 border-b px-4 py-2 transition-colors hover:bg-gray-50'
        >
          <div className='relative h-16 w-16 flex-shrink-0'>
            <Image
              src={imageUrl}
              alt={sellerInfo.nickname}
              fill
              className='rounded-md object-cover'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <span className='text-sm text-gray-500'>{status}</span>
            <h3 className='font-semibold'>{product.title}</h3>
            <p className='text-lg font-bold'>{`${formatNumber(price)}원`}</p>
          </div>
        </Link>
      </section>
    </header>
  );
}
