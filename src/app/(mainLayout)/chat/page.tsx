import { getChatList } from '@/actions/chat-service/get-chat-list';
import { ChatList } from '@/components/chat';
import { isErrorResponse } from '@/utils/type-guards';

export default async function ChatPage() {
  const chatList = await getChatList();
  if (isErrorResponse(chatList)) {
    return <div>채팅 내역 불러오기 실패</div>;
  }
  return (
    <div className='max-w-2xl mx-auto '>
      <ChatList chatList={chatList} />
    </div>
  );
}
