'use client';

import { useState } from 'react';
import type { AnalysisResults } from '../page';

interface ResultDisplayProps {
  results: AnalysisResults | null;
  isAnalyzing: boolean;
}

export default function ResultDisplay({
  results,
  isAnalyzing,
}: ResultDisplayProps) {
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [downloadFormat, setDownloadFormat] = useState<'word' | 'pdf'>('word');

  const handleDownload = async () => {
    if (!results || !results.results[selectedStudentIndex]) return;

    const currentResult = results.results[selectedStudentIndex];

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: currentResult,
          format: downloadFormat,
          tab: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error('다운로드 실패');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `이리사_${currentResult.studentName || `학생${selectedStudentIndex + 1}`}_${
        activeTab === 'teacher' ? '선생님용' : '학생용'
      }.${downloadFormat === 'word' ? 'docx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">분석 중입니다...</p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          <p className="text-xs text-gray-400 mt-2">
            분석의 최소 단위: 학생 1명 (Student Atomic Unit)
          </p>
        </div>
      </div>
    );
  }

  if (!results || results.results.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg">분석 결과가 여기에 표시됩니다</p>
          <p className="text-sm mt-2">
            왼쪽 폼에서 자료를 업로드하고 분석 생성을 눌러주세요
          </p>
        </div>
      </div>
    );
  }

  const currentResult = results.results[selectedStudentIndex];

  return (
    <div className="space-y-4">
      {/* 학생 선택 (여러 명일 경우) */}
      {results.results.length > 1 && (
        <div className="border-b border-gray-200 pb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            학생 선택
          </label>
          <div className="flex gap-2 flex-wrap">
            {results.results.map((result, index) => (
              <button
                key={index}
                onClick={() => setSelectedStudentIndex(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedStudentIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {result.studentName || `학생 ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 탭 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`${
              activeTab === 'teacher'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            선생님용 Fact 분석
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`${
              activeTab === 'student'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            학생/학부모용 분석
          </button>
        </nav>
      </div>

      {/* 결과 내용 */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
        {activeTab === 'teacher' ? (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800">
              {currentResult.teacherAnalysis}
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800">
              {currentResult.studentAnalysis}
            </div>
          </div>
        )}
      </div>

      {/* 다운로드 섹션 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">다운로드 형식:</span>
          <label className="flex items-center">
            <input
              type="radio"
              value="word"
              checked={downloadFormat === 'word'}
              onChange={() => setDownloadFormat('word')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Word</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="pdf"
              checked={downloadFormat === 'pdf'}
              onChange={() => setDownloadFormat('pdf')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">PDF</span>
          </label>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
        >
          다운로드
        </button>
      </div>
    </div>
  );
}
