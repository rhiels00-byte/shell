import type { InputData } from '../types';

interface InputFormProps {
  value: InputData;
  onChange: (next: InputData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function InputForm({ value, onChange, onSubmit, isLoading }: InputFormProps) {
  const update = (patch: Partial<InputData>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">분석 대상</h2>
        <div className="flex gap-3">
          {[
            { id: 'single', label: '학생 1명 분석' },
            { id: 'multiple', label: '학생 여러 명 분석' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => update({ target: option.id as InputData['target'] })}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                value.target === option.id
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-primary-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">학생 기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
            placeholder="학생 이름"
            value={value.studentName}
            onChange={(e) => update({ studentName: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
            placeholder="학생 순번 또는 번호"
            value={value.studentNumber}
            onChange={(e) => update({ studentNumber: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
            placeholder="학년 (예: 5학년)"
            value={value.grade}
            onChange={(e) => update({ grade: e.target.value })}
          />
          <select
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
            value={value.level}
            onChange={(e) => update({ level: e.target.value as InputData['level'] })}
          >
            <option value="elementary">초등</option>
            <option value="middle">중등</option>
            <option value="high">고등</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">자료 업로드</h2>
        <input
          type="file"
          multiple
          onChange={(e) => update({ files: Array.from(e.target.files ?? []) })}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
        />
        <p className="text-xs text-slate-500">
          영상 / PDF / 이미지 / 엑셀 등 형식 상관없이 업로드 가능합니다.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">자료-학생 매핑 확인</h2>
        <p className="text-sm text-slate-600">
          업로드된 자료를 자동으로 분해한 뒤, 학생별 매핑을 확인하는 단계입니다. (목업)
        </p>
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          예시: 파일 A p.1~3 → 학생 A / 파일 B 전체 → 학생 A
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">기준 문서 (선택)</h2>
        <textarea
          className="w-full min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
          placeholder="학교/교사 기준 문서나 줄글 기준표를 붙여넣으세요"
          value={value.referenceText}
          onChange={(e) => update({ referenceText: e.target.value })}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">추가 메모</h2>
        <textarea
          className="w-full min-h-[100px] rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
          placeholder="분석 시 참고할 추가 요청사항을 입력하세요"
          value={value.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full rounded-xl bg-primary-500 py-3 text-white font-semibold shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? '분석 생성 중...' : '분석 생성'}
      </button>
    </div>
  );
}
