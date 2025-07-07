import Link from 'next/link';

import { ChatSummary } from './ChatSummary';
import { ChatEmpty } from './ChatEmpty';
import type { ChatRoomWithMember } from '@/actions/chat-service/get-chat-list-with-members';

interface ChatListProps {
  chatList: ChatRoomWithMember[];
}

export function ChatList({ chatList }: ChatListProps) {
  if (chatList.length === 0) {
    return <ChatEmpty />;
  }
  return (
    <section>
      <ul>
        {chatList.map(({ chat, memberInfo }) => (
          <li key={chat.chatRoomUuid} className='py-1'>
            <Link
              href={`/chat/${chat.chatRoomUuid}?opponentUuid=${chat.opponentUuid}`}
              className='block rounded-xl transition'
            >
              <ChatSummary chat={chat} memberInfo={memberInfo} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
