import Image from 'next/image';
import type { ChatRoomSummary, ChatRoomThumbnail } from '@/types/chat';
import type { MemberSummary } from '@/types/member';
import { formatChatDate } from '@/utils/date';

interface ChatSummaryProps {
  chat: ChatRoomSummary;
  memberInfo: MemberSummary;
  thumbnail?: ChatRoomThumbnail;
}

export function ChatSummary({ chat, memberInfo, thumbnail }: ChatSummaryProps) {
  const profileUrl = memberInfo.profileImageUrl || '/images/dummy/dummy2.png';
  const nickname = memberInfo.nickname;
  const preview = chat.lastMessage;
  const messageType = chat.messageType;
  const date = chat.lastMessageSentAt ? new Date(chat.lastMessageSentAt) : null;
  const unreadCount = chat.unreadCount;

  // 썸네일 URL 설정 (실제 썸네일이 있으면 사용, 없으면 기본 이미지)
  const productImage = thumbnail?.thumbnailUrl || '/images/dummy/dummy1.png';

  return (
    <article className='flex items-center justify-between gap-4 py-3'>
      <section className='flex items-center gap-4 flex-1 min-w-0'>
        <figure className='flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-200'>
          <Image
            src={profileUrl || '/placeholder.svg'}
            alt={nickname}
            width={56}
            height={56}
            priority
            className='object-cover w-full h-full'
          />
        </figure>
        <div className='flex-1 min-w-0'>
          <header className='font-bold text-lg truncate'>{nickname}</header>
          <p className='text-gray-500 text-sm truncate max-w-xs'>
            {messageType === 'TEXT' || messageType === 'SYSTEM'
              ? preview
              : '사진'}
          </p>
        </div>
      </section>

      <aside className='flex items-center gap-3 flex-shrink-0'>
        <div className='flex flex-col justify-between items-end h-10'>
          <time
            className='text-xs text-gray-400 mb-1'
            dateTime={date?.toISOString()}
          >
            {formatChatDate(date)}
          </time>
          {unreadCount > 0 && (
            <span className='bg-primary-100 text-white rounded-full px-2 py-0.5 text-xs font-semibold'>
              {unreadCount}
            </span>
          )}
        </div>

        <figure className='w-10 h-10 rounded-lg overflow-hidden bg-gray-100'>
          <Image
            src={productImage || '/placeholder.svg'}
            alt='상품 썸네일'
            width={20}
            height={20}
            className='object-cover w-full h-full'
          />
        </figure>
      </aside>
    </article>
  );
}
