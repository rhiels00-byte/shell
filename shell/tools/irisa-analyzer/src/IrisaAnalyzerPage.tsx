import { useMemo, useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { createMockResult } from './lib/mock';
import type { AnalysisResult, InputData } from './types';

const defaultInput: InputData = {
  target: 'single',
  studentName: '',
  studentNumber: '',
  grade: '',
  level: 'elementary',
  referenceText: '',
  notes: '',
  files: [],
};

async function requestAnalysis(input: InputData): Promise<AnalysisResult> {
  const apiBase = import.meta.env.VITE_API_BASE?.toString().trim();
  if (!apiBase) {
    return createMockResult(input);
  }

  const response = await fetch(`${apiBase}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

export default function IrisaAnalyzerPage() {
  const [input, setInput] = useState<InputData>(defaultInput);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileLabel = useMemo(() => {
    if (input.files.length === 0) return '파일 없음';
    if (input.files.length === 1) return input.files[0].name;
    return `${input.files.length}개 파일 선택됨`;
  }, [input.files]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await requestAnalysis(input);
      setResult(response);
    } catch (err) {
      setError('분석 생성에 실패했습니다. 목업 결과를 대신 표시합니다.');
      setResult(createMockResult(input));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary-600">Irisa Analyzer</p>
          <h1 className="text-3xl font-bold text-slate-900">이리사 종합 분석기</h1>
          <p className="mt-2 text-slate-600">
            수업 산출물과 심리정서 데이터를 학생 단위로 재구성하여 상담/생기부에 바로
            활용할 수 있는 인사이트를 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">
          <div className="space-y-4">
            <InputForm
              value={input}
              onChange={setInput}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />
            <div className="text-xs text-slate-400">
              선택된 파일: {fileLabel}
            </div>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[580px]">
            <ResultDisplay result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
