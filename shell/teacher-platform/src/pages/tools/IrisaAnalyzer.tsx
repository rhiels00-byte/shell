import { useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import ToolExecutionLayout from '../../components/layout/ToolExecutionLayout';

type AnalysisTarget = 'single' | 'multiple';
type SchoolLevel = 'elementary' | 'middle' | 'high';

type MappingUnit = '전체' | '페이지' | '구간' | '행/표';

interface StudentEntry {
  name: string;
  number: string;
}

interface FileMapping {
  fileId: string;
  fileName: string;
  studentIndex: number | null;
  unit: MappingUnit;
  range: string;
}

interface InputData {
  target: AnalysisTarget;
  level: SchoolLevel;
  grade: string;
  students: StudentEntry[];
  notes: string;
  analysisFiles: File[];
  referenceFiles: File[];
  mappings: FileMapping[];
}

interface AnalysisResult {
  teacherSummary: string;
  studentSummary: string;
  recordGuide: string;
  generatedAt: string;
}

const defaultInput: InputData = {
  target: 'single',
  level: 'elementary',
  grade: '',
  students: [{ name: '', number: '' }],
  notes: '',
  analysisFiles: [],
  referenceFiles: [],
  mappings: [],
};

const tabs = [
  { id: 'teacher', label: '교사용 Fact 분석' },
  { id: 'student', label: '학생/학부모용 분석' },
  { id: 'record', label: '생기부 가이드' },
] as const;

const createMockResult = (input: InputData): AnalysisResult => ({
  teacherSummary: `교사용 Fact 분석 (목업)\n\n- 분석 대상: ${
    input.target === 'single' ? '학생 1명' : `학생 ${input.students.length}명`
  }\n- 학년/학교급: ${input.grade || '미입력'} / ${input.level}\n- 업로드 파일 수: ${input.analysisFiles.length}개\n- 기준표 파일 수: ${input.referenceFiles.length}개\n\n핵심 관찰\n1) 문제 이해 단계에서 시각적 단서를 적극 활용함.\n2) 풀이 과정 중 스스로 검증하는 메타인지 활동이 관찰됨.\n3) 결과보다 과정 서술이 풍부하여 상담 시 강점으로 활용 가능.\n\n유사 문항 제안\n- 난이도 중, 서술형 2문항\n- 강화: 계산 정확도 보완용 2문항\n`,
  studentSummary: `학생/학부모용 분석 (목업)\n\n- 학습 과정에서 스스로 점검하는 습관이 보여요.\n- 실수는 있었지만 해결 전략을 바꿔가며 끝까지 해낸 점이 훌륭해요.\n- 집에서는 풀이 과정을 말로 설명해보는 연습이 도움이 됩니다.\n`,
  recordGuide: `생기부 작성 가이드 (목업)\n\n학습 코칭 종합 의견\n- 문제 해결 과정에서 다양한 전략을 시도하며 자기 점검을 수행함.\n\n심리·정서 코칭 종합 의견\n- 실패에 대한 회복 탄력성이 높아 지속적인 도전이 가능함.\n\n통합 소견\n- 과정 중심 학습 태도가 안정적으로 형성되어 있음.\n`,
  generatedAt: new Date().toISOString(),
});

const toFileLabel = (files: File[]) => {
  if (files.length === 0) return '선택된 파일 없음';
  if (files.length === 1) return files[0].name;
  return `${files.length}개 파일 선택됨`;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** idx).toFixed(idx === 0 ? 0 : 1)}${units[idx]}`;
};

const fileIcon = (fileName: string) => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return '📄';
  if (lower.match(/\.(png|jpg|jpeg|gif|webp)$/)) return '🖼️';
  if (lower.match(/\.(mp4|mov|avi|mkv)$/)) return '🎥';
  if (lower.match(/\.(xls|xlsx|csv)$/)) return '📊';
  return '📎';
};

export default function IrisaAnalyzer() {
  const [input, setInput] = useState<InputData>(defaultInput);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>(
    'teacher'
  );

  const analysisFileLabel = useMemo(
    () => toFileLabel(input.analysisFiles),
    [input.analysisFiles]
  );
  const referenceFileLabel = useMemo(
    () => toFileLabel(input.referenceFiles),
    [input.referenceFiles]
  );

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

  const updateStudents = (next: StudentEntry[]) => {
    setInput({ ...input, students: next });
  };

  const addStudent = () => {
    updateStudents([...input.students, { name: '', number: '' }]);
  };

  const removeStudent = (index: number) => {
    const next = input.students.filter((_, idx) => idx !== index);
    updateStudents(next.length === 0 ? [{ name: '', number: '' }] : next);
  };

  const setStudent = (index: number, patch: Partial<StudentEntry>) => {
    const next = input.students.map((student, idx) =>
      idx === index ? { ...student, ...patch } : student
    );
    updateStudents(next);
  };

  const appendFiles = (key: 'analysisFiles' | 'referenceFiles', files: File[]) => {
    if (files.length === 0) return;
    const merged = [...input[key], ...files];
    const nextMappings =
      key === 'analysisFiles'
        ? merged.map((file) => {
            const id = `${file.name}-${file.size}-${file.lastModified}`;
            const existing = input.mappings.find((m) => m.fileId === id);
            return (
              existing ?? {
                fileId: id,
                fileName: file.name,
                studentIndex: input.target === 'single' ? 0 : null,
                unit: '전체',
                range: '전체',
              }
            );
          })
        : input.mappings;

    setInput({
      ...input,
      [key]: merged,
      mappings: nextMappings,
    });
  };

  const removeFile = (key: 'analysisFiles' | 'referenceFiles', index: number) => {
    const next = input[key].filter((_, idx) => idx !== index);
    const nextMappings =
      key === 'analysisFiles'
        ? input.mappings.filter((mapping) => mapping.fileName !== input[key][index]?.name)
        : input.mappings;
    setInput({ ...input, [key]: next, mappings: nextMappings });
  };

  const updateMapping = (fileId: string, patch: Partial<FileMapping>) => {
    setInput({
      ...input,
      mappings: input.mappings.map((mapping) =>
        mapping.fileId === fileId ? { ...mapping, ...patch } : mapping
      ),
    });
  };

  const InputComponent = (
    <div className="space-y-8">
      <div>
        <div className="text-lg font-semibold text-gray-900 mb-4">정보 입력</div>
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-5">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">
              학생 인원 수
            </div>
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
                    setInput({
                      ...input,
                      target: option.id as AnalysisTarget,
                      students:
                        option.id === 'single'
                          ? [{ name: '', number: '' }]
                          : input.students.length === 0
                          ? [{ name: '', number: '' }]
                          : input.students,
                      mappings:
                        option.id === 'single'
                          ? input.mappings.map((m) => ({ ...m, studentIndex: 0 }))
                          : input.mappings,
                    })
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">
              공통 정보 (같은 반 기준)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <input
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                placeholder="학년 (예: 5학년)"
                value={input.grade}
                onChange={(e) => setInput({ ...input, grade: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-900">학생 기본 정보</div>
              {input.target === 'multiple' && (
                <Button type="button" variant="outline" size="sm" onClick={addStudent}>
                  + 학생 추가
                </Button>
              )}
            </div>

            {input.target === 'single' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                  placeholder="학생 이름"
                  value={input.students[0]?.name ?? ''}
                  onChange={(e) => setStudent(0, { name: e.target.value })}
                />
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                  placeholder="학생 순번 또는 번호"
                  value={input.students[0]?.number ?? ''}
                  onChange={(e) => setStudent(0, { number: e.target.value })}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_72px] gap-3 text-xs text-gray-500">
                  <div>학생 이름</div>
                  <div>학생 번호</div>
                  <div></div>
                </div>
                {input.students.map((student, index) => (
                  <div
                    key={`${index}-${input.target}`}
                    className="grid grid-cols-[1fr_1fr_72px] gap-3 items-center"
                  >
                    <input
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                      placeholder={`학생 ${index + 1} 이름`}
                      value={student.name}
                      onChange={(e) => setStudent(index, { name: e.target.value })}
                    />
                    <input
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
                      placeholder="번호"
                      value={student.number}
                      onChange={(e) => setStudent(index, { number: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStudent(index)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              학생 여러 명 분석 시 이름/번호만 입력하면 됩니다. 학년/학교급은 공통입니다.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="text-lg font-semibold text-gray-900 mb-4">파일 업로드</div>
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-5">
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">
              분석 자료 업로드 (필수)
            </div>
            <input
              type="file"
              multiple
              onChange={(e) =>
                appendFiles('analysisFiles', Array.from(e.target.files ?? []))
              }
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
            />
            <div className="mt-2 text-xs text-gray-500">{analysisFileLabel}</div>
            <div className="mt-3 space-y-2">
              {input.analysisFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{fileIcon(file.name)}</span>
                    <span className="text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('analysisFiles', idx)}
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    제거
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              파일은 누적됩니다. 다시 선택하면 기존 파일에 추가됩니다.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">
              기준표 업로드 (선택)
            </div>
            <input
              type="file"
              multiple
              onChange={(e) =>
                appendFiles('referenceFiles', Array.from(e.target.files ?? []))
              }
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
            />
            <div className="mt-2 text-xs text-gray-500">{referenceFileLabel}</div>
            <div className="mt-3 space-y-2">
              {input.referenceFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{fileIcon(file.name)}</span>
                    <span className="text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('referenceFiles', idx)}
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    제거
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            파일과 학생 매핑을 최소 입력으로 확인하는 단계입니다. (목업)
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-900">자료-학생 매핑 확인</div>
            {input.analysisFiles.length === 0 ? (
              <div className="text-sm text-gray-500">분석 자료를 업로드하면 매핑이 표시됩니다.</div>
            ) : (
              <div className="space-y-3">
                {input.mappings.map((mapping) => (
                  <div
                    key={mapping.fileId}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between text-sm font-medium text-gray-800">
                      <span>{mapping.fileName}</span>
                      <span className="text-xs text-gray-400">자동 감지됨 (목업)</span>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-3">
                      <select
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none text-sm"
                        value={mapping.studentIndex ?? ''}
                        onChange={(e) =>
                          updateMapping(mapping.fileId, {
                            studentIndex: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                      >
                        <option value="">학생 선택</option>
                        {input.students.map((student, idx) => (
                          <option key={`${student.name}-${idx}`} value={idx}>
                            {student.name || `학생 ${idx + 1}`} {student.number ? `(${student.number})` : ''}
                          </option>
                        ))}
                      </select>
                      <select
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none text-sm"
                        value={mapping.unit}
                        onChange={(e) =>
                          updateMapping(mapping.fileId, {
                            unit: e.target.value as MappingUnit,
                          })
                        }
                      >
                        <option value="전체">전체</option>
                        <option value="페이지">페이지</option>
                        <option value="구간">구간</option>
                        <option value="행/표">행/표</option>
                      </select>
                      <input
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none text-sm"
                        placeholder="예: p.1-3, 00:30-02:10"
                        value={mapping.range}
                        onChange={(e) =>
                          updateMapping(mapping.fileId, { range: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="text-lg font-semibold text-gray-900 mb-4">추가 메모</div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <textarea
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none resize-none"
            rows={4}
            placeholder="분석 시 참고할 추가 요청사항을 입력하세요"
            value={input.notes}
            onChange={(e) => setInput({ ...input, notes: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
        {isLoading ? '분석 생성 중...' : '분석 생성'}
      </Button>
    </div>
  );

  const OutputComponent = !result ? (
    <div className="text-center text-gray-500 py-12">
      <div className="text-4xl mb-4">📝</div>
      <p className="font-medium text-gray-700">왼쪽에서 정보를 입력하고</p>
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
