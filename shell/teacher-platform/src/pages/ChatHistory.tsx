import { useState } from 'react';
import Card from '../components/common/Card';
import type { ChatSession } from '../types';

// 샘플 데이터
const sampleChats: ChatSession[] = [
  {
    chatId: 'chat_001',
    toolId: 'tool_1',
    toolName: '퀴즈 생성기',
    createdAt: '2026-01-30T10:30:00Z',
    messages: [
      {
        role: 'user',
        content: '수학 2단원 퀴즈 만들어줘',
        timestamp: '2026-01-30T10:30:00Z',
      },
      {
        role: 'assistant',
        content: '네, 수학 2단원 퀴즈를 생성했습니다.',
        timestamp: '2026-01-30T10:30:05Z',
      },
    ],
    outputId: 'output_001',
  },
  {
    chatId: 'chat_002',
    toolId: 'tool_3',
    toolName: '성적 분석기',
    createdAt: '2026-01-29T14:20:00Z',
    messages: [
      {
        role: 'user',
        content: '2-3반 성적 분석해줘',
        timestamp: '2026-01-29T14:20:00Z',
      },
      {
        role: 'assistant',
        content: '2-3반 성적 분석 결과입니다.',
        timestamp: '2026-01-29T14:20:10Z',
      },
    ],
    outputId: 'output_002',
  },
];

export default function ChatHistory() {
  const [chats] = useState<ChatSession[]>(sampleChats);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">채팅 내역</h1>
          <p className="text-gray-600">
            도구 사용 시 나눈 대화를 확인할 수 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 채팅 목록 */}
          <div className="lg:col-span-1 space-y-3">
            {chats.map((chat) => (
              <Card
                key={chat.chatId}
                hoverable
                onClick={() => setSelectedChat(chat)}
                className={
                  selectedChat?.chatId === chat.chatId
                    ? 'border-2 border-primary-500'
                    : ''
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {chat.toolName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.messages[0]?.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(chat.createdAt)}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    🗑️
                  </button>
                </div>
              </Card>
            ))}

            {chats.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">채팅 내역이 없습니다</p>
              </div>
            )}
          </div>

          {/* 채팅 상세 */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <Card>
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedChat.toolName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedChat.createdAt)}
                  </p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {selectedChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user'
                              ? 'text-primary-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-20 text-gray-500">
                  대화를 선택하여 내용을 확인하세요
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
