import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import type { Output } from '../types';

// 샘플 데이터
const sampleOutputs: Output[] = [
  {
    outputId: 'output_001',
    toolId: 'tool_1',
    toolName: '퀴즈 생성기',
    title: '수학 2단원 퀴즈',
    type: 'download',
    format: 'xlsx',
    fileUrl: '/outputs/quiz_001.xlsx',
    createdAt: '2026-01-30T10:30:05Z',
    chatId: 'chat_001',
    metadata: {
      subject: '수학',
      grade: 2,
      unit: 2,
    },
  },
  {
    outputId: 'output_002',
    toolId: 'tool_3',
    toolName: '성적 분석기',
    title: '2-3반 성적 분석 리포트',
    type: 'download',
    format: 'pdf',
    fileUrl: '/outputs/report_001.pdf',
    createdAt: '2026-01-29T14:20:10Z',
    chatId: 'chat_002',
    metadata: {
      class: '2-3',
    },
  },
  {
    outputId: 'output_003',
    toolId: 'tool_6',
    toolName: 'QR 코드 생성기',
    title: '수업 자료 QR 코드',
    type: 'download',
    format: 'png',
    fileUrl: '/outputs/qr_001.png',
    createdAt: '2026-01-28T09:15:30Z',
    chatId: 'chat_003',
  },
  {
    outputId: 'output_004',
    toolId: 'tool_4',
    toolName: '교안 작성 도우미',
    title: '과학 3단원 교안',
    type: 'copy',
    content: '이것은 교안 내용입니다...',
    createdAt: '2026-01-27T16:45:00Z',
    chatId: 'chat_004',
  },
];

export default function Materials() {
  const [outputs] = useState<Output[]>(sampleOutputs);
  const [filter, setFilter] = useState<'all' | 'download' | 'copy'>('all');

  const filteredOutputs =
    filter === 'all'
      ? outputs
      : outputs.filter((output) => output.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'xlsx':
        return '📊';
      case 'pdf':
        return '📄';
      case 'png':
      case 'jpg':
        return '🖼️';
      case 'qr':
        return '📱';
      case 'text':
        return '📝';
      default:
        return '📁';
    }
  };

  const handleDownload = (output: Output) => {
    console.log('Download:', output);
    // TODO: 실제 다운로드 로직
  };

  const handleCopy = (output: Output) => {
    if (output.content) {
      navigator.clipboard.writeText(output.content);
      alert('클립보드에 복사되었습니다');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">만든 자료</h1>
          <p className="text-gray-600">
            도구를 통해 생성한 자료를 확인하고 다운로드할 수 있습니다
          </p>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('download')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'download'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            다운로드형
          </button>
          <button
            onClick={() => setFilter('copy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'copy'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            복사형
          </button>
        </div>

        {/* 자료 목록 */}
        {filteredOutputs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutputs.map((output) => (
              <Card key={output.outputId}>
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">
                      {getFormatIcon(output.format)}
                    </div>
                    <span
                      className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${
                        output.type === 'download'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }
                    `}
                    >
                      {output.type === 'download' ? '다운로드' : '복사'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {output.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    도구: {output.toolName}
                  </p>

                  <p className="text-xs text-gray-400 mb-4">
                    {formatDate(output.createdAt)}
                  </p>

                  <div className="mt-auto flex gap-2">
                    {output.type === 'download' ? (
                      <Button
                        onClick={() => handleDownload(output)}
                        className="flex-1"
                        size="sm"
                      >
                        다운로드
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleCopy(output)}
                        className="flex-1"
                        size="sm"
                      >
                        복사
                      </Button>
                    )}
                    <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">만든 자료가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
