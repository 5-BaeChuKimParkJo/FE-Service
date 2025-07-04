import { getChatListWithMembers } from '@/actions/chat-service/get-chat-list-with-members';
import { ChatPageClient } from '@/components/chat';
import ErrorText from '@/components/ui/error-text';

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  try {
    const initialChatList = await getChatListWithMembers();

    return <ChatPageClient initialChatList={initialChatList} />;
  } catch {
    return <ErrorText>채팅 내역 불러오기 실패</ErrorText>;
  }
}
