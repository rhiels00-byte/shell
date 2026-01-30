import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolGrid from '../components/features/ToolGrid';
import type { Tool } from '../types';

// 샘플 도구 데이터
const sampleTools: Tool[] = [
  {
    id: 'tool_1',
    name: '퀴즈 생성기',
    description: '단원과 난이도에 맞는 퀴즈를 자동으로 생성합니다',
    icon: '📝',
    category: 'create',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tool_2',
    name: '학습지 생성기',
    description: '맞춤형 학습지를 빠르게 제작합니다',
    icon: '📄',
    category: 'create',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tool_3',
    name: '성적 분석기',
    description: '학생 성적을 분석하고 리포트를 생성합니다',
    icon: '📊',
    category: 'analyze',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tool_4',
    name: '교안 작성 도우미',
    description: 'AI가 교안 작성을 도와드립니다',
    icon: '📚',
    category: 'create',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tool_5',
    name: '수업 자료 검색',
    description: '수업에 필요한 자료를 빠르게 찾아드립니다',
    icon: '🔍',
    category: 'analyze',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tool_6',
    name: 'QR 코드 생성기',
    description: '수업 자료 링크를 QR 코드로 변환합니다',
    icon: '📱',
    category: 'create',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'expected-questions-generator',
    name: '예상 질문 리스트 만들기',
    description: '학생들이 물어볼만한 예상 질문과 답변을 생성합니다',
    icon: '❓',
    category: 'create',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted prompt:', prompt);
    // TODO: AI 처리 로직 추가
  };

  const handleToolClick = (tool: Tool) => {
    navigate(`/tool/${tool.id}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Prompt Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            무엇을 도와드릴까요?
          </h2>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="무엇을 도와드릴까요?"
                className="w-full px-6 py-4 pr-24 border-2 border-gray-200 rounded-2xl text-base resize-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                rows={3}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="파일 첨부"
                >
                  📎
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="음성 입력"
                >
                  🎤
                </button>
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  전송
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tools Grid Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">추천 도구</h3>
            <a
              href="/tools"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              전체 보기 →
            </a>
          </div>

          <ToolGrid tools={sampleTools} onToolClick={handleToolClick} />
        </div>
      </div>
    </div>
  );
}
