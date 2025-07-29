'use client';

import React from 'react';

interface ChatRoomSettingsProps {
  memberUuid: string;
  chatRoomUuid: string;
  opponentUuid: string;
  isConnected: boolean;
  onMemberUuidChange: (uuid: string) => void;
  onChatRoomUuidChange: (uuid: string) => void;
  onOpponentUuidChange: (uuid: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const ChatRoomSettings = React.memo<ChatRoomSettingsProps>(
  ({
    memberUuid,
    chatRoomUuid,
    opponentUuid,
    isConnected,
    onMemberUuidChange,
    onChatRoomUuidChange,
    onOpponentUuidChange,
    onConnect,
    onDisconnect,
  }) => {
    return (
      <div className='bg-white border rounded-lg p-6 mb-4 shadow-sm'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              유저 UUID
            </label>
            <input
              type='text'
              value={memberUuid}
              onChange={(e) => onMemberUuidChange(e.target.value)}
              disabled={isConnected}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              채팅방 UUID
            </label>
            <input
              type='text'
              value={chatRoomUuid}
              onChange={(e) => onChatRoomUuidChange(e.target.value)}
              disabled={isConnected}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              상대방 UUID
            </label>
            <input
              type='text'
              value={opponentUuid}
              onChange={(e) => onOpponentUuidChange(e.target.value)}
              disabled={isConnected}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
            />
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={onConnect}
            disabled={isConnected}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            채팅방 입장
          </button>
          <button
            onClick={onDisconnect}
            disabled={!isConnected}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            채팅방 나가기
          </button>
        </div>

        {/* 연결 상태 표시 */}
        <div className='mt-4 flex items-center gap-2'>
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className='text-sm text-gray-600'>
            {isConnected ? '연결됨' : '연결 안됨'}
          </span>
        </div>
      </div>
    );
  },
);

ChatRoomSettings.displayName = 'ChatRoomSettings';
