import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ToolGrid from '../components/features/ToolGrid';
import type { Tool } from '../types';

// 샘플 도구 데이터 (실제로는 API에서 가져옴)
const allTools: Tool[] = [
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
    id: 'tool_7',
    name: '수업 피드백 분석',
    description: '학생 피드백을 분석하여 인사이트를 제공합니다',
    icon: '💡',
    category: 'analyze',
    version: '1.0',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tool_8',
    name: '출제 문제 검토',
    description: '출제한 문제의 적정성을 검토합니다',
    icon: '✅',
    category: 'analyze',
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

type Category = 'all' | 'create' | 'analyze';

export default function Tools() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const category = (searchParams.get('category') || 'all') as Category;

  const filteredTools = useMemo(() => {
    let filtered = allTools;

    // 카테고리 필터
    if (category !== 'all') {
      filtered = filtered.filter((tool) => tool.category === category);
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [category, searchQuery]);

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: newCategory });
    }
  };

  const handleToolClick = (tool: Tool) => {
    navigate(`/tool/${tool.id}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">도구</h1>
          <p className="text-gray-600">원하는 도구를 선택하여 사용해보세요</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="도구 검색..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              category === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => handleCategoryChange('create')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              category === 'create'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            생성
          </button>
          <button
            onClick={() => handleCategoryChange('analyze')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              category === 'analyze'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            분석
          </button>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <ToolGrid tools={filteredTools} onToolClick={handleToolClick} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
