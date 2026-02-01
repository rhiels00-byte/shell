'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ToolGrid from '@/app/components/features/ToolGrid';
import toolsConfig from '../tools-config.json';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const tools = toolsConfig.tools.filter(tool => tool.enabled).map(tool => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    icon: tool.icon,
    category: tool.category as 'create' | 'analyze',
    version: tool.version,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted prompt:', prompt);
  };

  const handleToolClick = (tool: any) => {
    const toolConfig = toolsConfig.tools.find(t => t.id === tool.id);
    if (toolConfig && toolConfig.isExternal) {
      router.push(toolConfig.route);
    } else {
      router.push(`/tool/${tool.id}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
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

          <ToolGrid tools={tools} onToolClick={handleToolClick} />
        </div>
      </div>
    </div>
  );
}
