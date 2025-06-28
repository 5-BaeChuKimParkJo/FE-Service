import { getChatListWithMembers } from '@/actions/chat-service/get-chat-list-with-members';
import { ChatPageClient } from '@/components/chat';
import { isErrorResponse } from '@/utils/type-guards';

// 쿠키를 사용하므로 dynamic 설정 필요
export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  const initialChatList = await getChatListWithMembers();

  if (isErrorResponse(initialChatList)) {
    return <div>채팅 내역 불러오기 실패</div>;
  }

  return <ChatPageClient initialChatList={initialChatList} />;
}
