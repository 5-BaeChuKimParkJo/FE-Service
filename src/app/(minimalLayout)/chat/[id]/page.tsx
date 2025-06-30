import { getChatHistory, getChatroomInfo } from '@/actions/chat-service';
import { getMemberSummary } from '@/actions/member-service';
import { ChatRoomHeader } from '@/components/chat';
import { ChatRoom } from '@/components/chat/ChatRoom';

export default async function ChatRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ opponentUuid: string }>;
}) {
  const { id } = await params;
  const { opponentUuid } = await searchParams;

  const initialChat = await getChatHistory(id);

  const chatroomInfo = await getChatroomInfo(id);

  const opponentInfo = await getMemberSummary(opponentUuid);

  const memberUuid = chatroomInfo.members.find(
    (member) => member.memberUuid !== opponentUuid,
  )?.memberUuid;

  return (
    <div className='flex flex-col h-screen bg-white'>
      <ChatRoomHeader />
      <div className='flex-1 min-h-0'>
        <ChatRoom
          initialChat={initialChat.items}
          initialNextCursor={initialChat.nextCursor}
          opponentInfo={opponentInfo}
          chatroomInfo={chatroomInfo}
          memberUuid={memberUuid as string}
        />
      </div>
    </div>
  );
}
