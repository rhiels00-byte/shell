import { useState } from 'react';
import type { AnalysisResult } from '../types';

interface ResultDisplayProps {
  result: AnalysisResult | null;
}

const tabs = [
  { id: 'teacher', label: '교사용 Fact 분석' },
  { id: 'student', label: '학생/학부모용 분석' },
  { id: 'record', label: '생기부 가이드' },
] as const;

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [active, setActive] = useState<typeof tabs[number]['id']>('teacher');

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
        왼쪽에서 정보를 입력하고 분석 생성 버튼을 눌러주세요.
      </div>
    );
  }

  const content =
    active === 'teacher'
      ? result.teacherSummary
      : active === 'student'
      ? result.studentSummary
      : result.recordGuide;

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition ${
              active === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex-1 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-800">
        {content}
      </div>
      <div className="mt-4 text-xs text-slate-400">
        생성 시간: {new Date(result.generatedAt).toLocaleString()}
      </div>
    </div>
  );
}
