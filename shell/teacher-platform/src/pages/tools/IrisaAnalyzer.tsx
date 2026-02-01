import { useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import ToolExecutionLayout from '../../components/layout/ToolExecutionLayout';

type AnalysisTarget = 'single' | 'multiple';
type SchoolLevel = 'elementary' | 'middle' | 'high';

interface InputData {
  target: AnalysisTarget;
  studentName: string;
  studentNumber: string;
  grade: string;
  level: SchoolLevel;
  referenceText: string;
  notes: string;
  files: File[];
}

interface AnalysisResult {
  teacherSummary: string;
  studentSummary: string;
  recordGuide: string;
  generatedAt: string;
}

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

const tabs = [
  { id: 'teacher', label: '교사용 Fact 분석' },
  { id: 'student', label: '학생/학부모용 분석' },
  { id: 'record', label: '생기부 가이드' },
] as const;

const createMockResult = (input: InputData): AnalysisResult => ({
  teacherSummary: `교사용 Fact 분석 (목업)\n\n- 분석 대상: ${
    input.target === 'single' ? '학생 1명' : '학생 여러 명'
  }\n- 학생: ${input.studentName || '미입력'} / ${input.studentNumber || '미입력'}\n- 학년/학교급: ${input.grade || '미입력'} / ${input.level}\n- 업로드 파일 수: ${input.files.length}개\n\n핵심 관찰\n1) 문제 이해 단계에서 시각적 단서를 적극 활용함.\n2) 풀이 과정 중 스스로 검증하는 메타인지 활동이 관찰됨.\n3) 결과보다 과정 서술이 풍부하여 상담 시 강점으로 활용 가능.\n\n유사 문항 제안\n- 난이도 중, 서술형 2문항\n- 강화: 계산 정확도 보완용 2문항\n`,
  studentSummary: `학생/학부모용 분석 (목업)\n\n- 학습 과정에서 스스로 점검하는 습관이 보여요.\n- 실수는 있었지만 해결 전략을 바꿔가며 끝까지 해낸 점이 훌륭해요.\n- 집에서는 풀이 과정을 말로 설명해보는 연습이 도움이 됩니다.\n`,
  recordGuide: `생기부 작성 가이드 (목업)\n\n학습 코칭 종합 의견\n- 문제 해결 과정에서 다양한 전략을 시도하며 자기 점검을 수행함.\n\n심리·정서 코칭 종합 의견\n- 실패에 대한 회복 탄력성이 높아 지속적인 도전이 가능함.\n\n통합 소견\n- 과정 중심 학습 태도가 안정적으로 형성되어 있음.\n`,
  generatedAt: new Date().toISOString(),
});

export default function IrisaAnalyzer() {
  const [input, setInput] = useState<InputData>(defaultInput);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>(
    'teacher'
  );

  const fileLabel = useMemo(() => {
    if (input.files.length === 0) return '선택된 파일 없음';
    if (input.files.length === 1) return input.files[0].name;
    return `${input.files.length}개 파일 선택됨`;
  }, [input.files]);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    setActiveTab('teacher');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResult(createMockResult(input));
    setIsLoading(false);
  };

  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    if (!result) return;
    if (type === 'copy') {
      navigator.clipboard.writeText(
        [result.teacherSummary, result.studentSummary, result.recordGuide].join(
          '\n\n'
        )
      );
      alert('결과를 클립보드에 복사했습니다.');
      return;
    }
    if (type === 'download') {
      const blob = new Blob(
        [result.teacherSummary, result.studentSummary, result.recordGuide],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'irisa-analysis.txt';
      link.click();
      URL.revokeObjectURL(url);
      return;
    }
    alert('만든 자료함에 저장했습니다.');
  };

  const InputComponent = (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">분석 대상</div>
        <div className="flex gap-2">
          {[
            { id: 'single', label: '학생 1명 분석' },
            { id: 'multiple', label: '학생 여러 명 분석' },
          ].map((option) => (
            <Button
              key={option.id}
              type="button"
              variant={input.target === option.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() =>
                setInput({ ...input, target: option.id as AnalysisTarget })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">
          학생 기본 정보
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
            placeholder="학생 이름"
            value={input.studentName}
            onChange={(e) => setInput({ ...input, studentName: e.target.value })}
          />
          <input
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
            placeholder="학생 순번 또는 번호"
            value={input.studentNumber}
            onChange={(e) =>
              setInput({ ...input, studentNumber: e.target.value })
            }
          />
          <input
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
            placeholder="학년 (예: 5학년)"
            value={input.grade}
            onChange={(e) => setInput({ ...input, grade: e.target.value })}
          />
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
            value={input.level}
            onChange={(e) =>
              setInput({ ...input, level: e.target.value as SchoolLevel })
            }
          >
            <option value="elementary">초등</option>
            <option value="middle">중등</option>
            <option value="high">고등</option>
          </select>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">자료 업로드</div>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setInput({ ...input, files: Array.from(e.target.files ?? []) })
          }
          className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
        />
        <div className="mt-2 text-xs text-gray-500">{fileLabel}</div>
        <p className="text-xs text-gray-500 mt-2">
          영상 / PDF / 이미지 / 엑셀 등 형식 상관없이 업로드 가능합니다.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        업로드된 자료를 자동으로 분해한 뒤, 학생별 매핑을 확인하는 단계입니다. (목업)
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">
          기준 문서 (선택)
        </div>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none resize-none"
          rows={4}
          placeholder="학교/교사 기준 문서나 줄글 기준표를 붙여넣으세요"
          value={input.referenceText}
          onChange={(e) =>
            setInput({ ...input, referenceText: e.target.value })
          }
        />
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">추가 메모</div>
        <textarea
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none resize-none"
          rows={3}
          placeholder="분석 시 참고할 추가 요청사항을 입력하세요"
          value={input.notes}
          onChange={(e) => setInput({ ...input, notes: e.target.value })}
        />
      </div>

      <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
        {isLoading ? '분석 생성 중...' : '분석 생성'}
      </Button>
    </div>
  );

  const OutputComponent = !result ? (
    <div className="text-center text-gray-500 py-12">
      <div className="text-4xl mb-4">📝</div>
      <p className="font-medium text-gray-700">
        왼쪽에서 정보를 입력하고
      </p>
      <p className="text-gray-500 mt-2">[분석 생성] 버튼을 눌러주세요</p>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
        {activeTab === 'teacher'
          ? result.teacherSummary
          : activeTab === 'student'
          ? result.studentSummary
          : result.recordGuide}
      </div>
      <div className="text-xs text-gray-400">
        생성 시간: {new Date(result.generatedAt).toLocaleString()}
      </div>
    </div>
  );

  return (
    <ToolExecutionLayout
      toolId="irisa-analyzer"
      toolName="이리사 종합 분석기"
      inputComponent={InputComponent}
      outputComponent={OutputComponent}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
}
