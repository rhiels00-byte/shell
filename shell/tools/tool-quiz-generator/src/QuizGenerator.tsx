import { useState } from 'react';
import ToolExecutionLayout from '../../../teacher-platform/src/components/layout/ToolExecutionLayout';
import Button from '../../../teacher-platform/src/components/common/Button';

export default function QuizGenerator() {
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    unit: '',
    difficulty: '',
    questionCount: '10',
  });

  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // TODO: 실제 AI 생성 로직 구현
    setTimeout(() => {
      setOutput(`[퀴즈 생성 결과]\n과목: ${formData.subject}\n학년: ${formData.grade}\n단원: ${formData.unit}\n난이도: ${formData.difficulty}\n문제 수: ${formData.questionCount}개`);
      setIsLoading(false);
    }, 2000);
  };

  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    console.log(`Save as ${type}:`, output);
    // TODO: 실제 저장 로직 구현
  };

  const isFormValid = formData.subject && formData.grade && formData.unit && formData.difficulty;

  const inputComponent = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          과목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="예: 수학"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          학년 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">선택하세요</option>
          <option value="초1">초등 1학년</option>
          <option value="초2">초등 2학년</option>
          <option value="초3">초등 3학년</option>
          <option value="초4">초등 4학년</option>
          <option value="초5">초등 5학년</option>
          <option value="초6">초등 6학년</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          단원 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="예: 분수의 덧셈과 뺄셈"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          난이도 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">선택하세요</option>
          <option value="easy">쉬움</option>
          <option value="medium">보통</option>
          <option value="hard">어려움</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          문제 수
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={formData.questionCount}
          onChange={(e) => setFormData({ ...formData, questionCount: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        {isLoading ? '생성 중...' : '퀴즈 생성하기'}
      </Button>
    </div>
  );

  const outputComponent = output ? (
    <div className="prose max-w-none">
      <pre className="whitespace-pre-wrap">{output}</pre>
    </div>
  ) : (
    <div className="text-center text-gray-500 py-12">
      왼쪽에서 정보를 입력하고 '퀴즈 생성하기' 버튼을 클릭하세요.
    </div>
  );

  return (
    <ToolExecutionLayout
      toolId="quiz-generator"
      toolName="퀴즈 생성기"
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
}
