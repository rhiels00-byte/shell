import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ToolExecutionLayout from '../components/layout/ToolExecutionLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// 샘플 도구 데이터
const toolsData: Record<string, { name: string; description: string }> = {
  tool_1: { name: '퀴즈 생성기', description: '단원과 난이도에 맞는 퀴즈를 생성합니다' },
  tool_2: { name: '학습지 생성기', description: '맞춤형 학습지를 제작합니다' },
  tool_3: { name: '성적 분석기', description: '학생 성적을 분석합니다' },
  tool_4: { name: '교안 작성 도우미', description: '교안 작성을 도와드립니다' },
  tool_5: { name: '수업 자료 검색', description: '수업 자료를 검색합니다' },
  tool_6: { name: 'QR 코드 생성기', description: 'QR 코드를 생성합니다' },
};

export default function ToolExecution() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    difficulty: '',
  });
  const [output, setOutput] = useState<string>('');

  const tool = toolsData[toolId || ''];

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            도구를 찾을 수 없습니다
          </h2>
          <Button onClick={() => navigate('/tools')}>도구 목록으로</Button>
        </div>
      </div>
    );
  }

  const handleGenerate = () => {
    setIsLoading(true);
    setOutput('');

    // 시뮬레이션: 2초 후 결과 생성
    setTimeout(() => {
      setOutput(
        `# ${tool.name} 결과\n\n과목: ${formData.subject}\n학년: ${formData.grade}\n주제: ${formData.topic}\n난이도: ${formData.difficulty}\n\n생성된 내용이 여기에 표시됩니다.\n\n이것은 샘플 데이터입니다. 실제로는 AI가 생성한 내용이 표시됩니다.`
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    switch (type) {
      case 'download':
        alert('파일 다운로드 기능 (구현 예정)');
        break;
      case 'copy':
        if (output) {
          navigator.clipboard.writeText(output);
          alert('클립보드에 복사되었습니다!');
        } else {
          alert('복사할 내용이 없습니다.');
        }
        break;
      case 'archive':
        alert('만든 자료함에 저장되었습니다!');
        setTimeout(() => navigate('/materials'), 1000);
        break;
    }
  };

  // 입력 컴포넌트
  const InputComponent = (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">{tool.description}</p>

      <Input
        label="과목"
        placeholder="예: 수학, 국어, 과학"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          학년
        </label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
        >
          <option value="">학년 선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
          <option value="4">4학년</option>
          <option value="5">5학년</option>
          <option value="6">6학년</option>
        </select>
      </div>

      <Input
        label="주제"
        placeholder="예: 덧셈과 뺄셈, 문장의 구조"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          난이도
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
        >
          <option value="">난이도 선택</option>
          <option value="easy">쉬움</option>
          <option value="medium">보통</option>
          <option value="hard">어려움</option>
        </select>
      </div>

      <Button
        onClick={handleGenerate}
        className="w-full mt-6"
        disabled={
          !formData.subject ||
          !formData.grade ||
          !formData.topic ||
          !formData.difficulty ||
          isLoading
        }
      >
        {isLoading ? '생성 중...' : '생성하기'}
      </Button>
    </div>
  );

  // 출력 컴포넌트
  const OutputComponent = output ? (
    <div className="prose max-w-none">
      <pre className="whitespace-pre-wrap font-sans text-gray-900">
        {output}
      </pre>
    </div>
  ) : (
    <div className="text-center text-gray-500 py-20">
      왼쪽에서 정보를 입력하고 '생성하기' 버튼을 클릭하세요.
    </div>
  );

  return (
    <ToolExecutionLayout
      toolId={toolId || ''}
      toolName={tool.name}
      inputComponent={InputComponent}
      outputComponent={OutputComponent}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
}
