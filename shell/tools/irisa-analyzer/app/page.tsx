'use client';

import { useState } from 'react';
import InputForm, { type AnalyzeData } from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import type { StudentAnalysisResult } from './types';

export interface AnalysisResults {
  results: StudentAnalysisResult[];
}

export default function Home() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (data: AnalyzeData) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();

      // 기본 정보
      formData.append('mode', data.mode);
      formData.append('schoolLevel', data.schoolLevel);
      formData.append('grade', data.grade);
      formData.append('students', JSON.stringify(data.students));

      // 파일 추가
      data.files.forEach((uploadedFile) => {
        formData.append(`file_${uploadedFile.type}`, uploadedFile.file);
        formData.append(`fileType_${uploadedFile.id}`, uploadedFile.type);
      });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '분석 요청 실패');
      }

      const analysisResults = await response.json();
      setResults(analysisResults);
    } catch (error) {
      console.error('분석 오류:', error);
      alert(
        error instanceof Error
          ? error.message
          : '분석 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            이리사 종합 분석기
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            그래서 그랬구나! - 수업 산출물 종합 분석 도구 (Step 2: N명 분석)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 좌측: 입력 영역 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              분석 자료 입력
            </h2>
            <InputForm
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              hasResult={!!results}
            />
          </div>

          {/* 우측: 결과 영역 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                분석 결과
              </h2>
              {results && (
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  다시하기
                </button>
              )}
            </div>
            <ResultDisplay results={results} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </div>
    </main>
  );
}
