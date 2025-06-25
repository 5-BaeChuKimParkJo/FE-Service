import Image from 'next/image';
import type { ChatRoomSummary } from '@/types/chat';
import { getMemberSummary } from '@/actions/member-service';
import { isErrorResponse } from '@/utils/type-guards';
import { formatChatDate } from '@/utils/date';

interface ChatSummaryProps {
  chat: ChatRoomSummary;
}

export async function ChatSummary({ chat }: ChatSummaryProps) {
  const memberInfo = await getMemberSummary(chat.opponentUuid);
  if (isErrorResponse(memberInfo)) {
    return <div>채팅 상대 정보 불러오기 실패</div>;
  }
  const profileUrl = memberInfo.profileImageUrl || '/images/dummy/dummy2.png';
  const nickname = memberInfo.nickname;
  const preview = chat.lastMessage;
  const messageType = chat.messageType;
  const date = chat.lastMessageSentAt ? new Date(chat.lastMessageSentAt) : null;
  const unreadCount = chat.unreadCount;
  const productImage = '/images/dummy/dummy1.png';

  return (
    <article className='flex items-center justify-between gap-4 py-3 '>
      <section className='flex items-center gap-4 flex-1 min-w-0'>
        <figure className='flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-200'>
          <Image
            src={profileUrl || '/placeholder.svg'}
            alt={nickname}
            width={56}
            height={56}
            className='object-cover w-full h-full'
          />
        </figure>
        <div className='flex-1 min-w-0'>
          <header className='font-bold text-lg truncate'>{nickname}</header>
          <p className='text-gray-500 text-sm truncate max-w-xs'>
            {messageType === 'TEXT' ? preview : '사진'}
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
            width={40}
            height={40}
            className='object-cover w-full h-full'
          />
        </figure>
      </aside>
    </article>
  );
}
