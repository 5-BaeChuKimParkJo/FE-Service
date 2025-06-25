import Link from 'next/link';

import { ChatRoomSummary } from '@/types/chat';
import { ChatSummary } from './ChatSummary';

export function ChatList({ chatList }: { chatList: ChatRoomSummary[] }) {
  if (chatList.length === 0) {
    return <div>활성화 된 채팅이 없습니다.</div>;
  }
  return (
    <section>
      <ul>
        {chatList.map((chat) => (
          <li key={chat.chatRoomUuid} className='py-1 '>
            <Link
              href={`/chat/${chat.chatRoomUuid}`}
              className='block rounded-xl transition'
            >
              <ChatSummary chat={chat} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
