'use client';
import { createChatRoom } from '@/actions/chat-service';
import { Button } from '@/components/ui';
import { cn } from '@/libs/cn';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ChatButtonSectionProps {
  productUuid: string;
  sellerUuid: string;
}

export function ChatButtonSection({
  productUuid,
  sellerUuid,
}: ChatButtonSectionProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const handleChatClick = async () => {
    try {
      setIsPending(true);

      const chatRoomUuid = await createChatRoom(productUuid, sellerUuid);
      router.push(`/chat/${chatRoomUuid}?opponentUuid=${sellerUuid}`);
    } catch (error) {
      console.error('채팅하기 클릭 오류:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <footer className='fixed bottom-0 left-0 right-0   px-4 py-3 safe-area-bottom'>
      <div className='max-w-2xl mx-auto'>
        <Button
          onClick={handleChatClick}
          isPending={isPending}
          className={cn(
            'w-full flex items-center justify-center gap-2 bg-primary-100 text-white',
            'py-4 rounded-xl transition-colors touch-manipulation',
          )}
        >
          채팅하기
        </Button>
      </div>
    </footer>
  );
}
