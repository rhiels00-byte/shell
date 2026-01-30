import { useState } from 'react';
import ToolExecutionLayout from '../../../teacher-platform/src/components/layout/ToolExecutionLayout';
import Button from '../../../teacher-platform/src/components/common/Button';

/**
 * 도구 템플릿
 *
 * 이 파일을 복사하여 새로운 도구를 만들 수 있습니다.
 *
 * 수정 사항:
 * 1. 컴포넌트 이름 변경 (ToolTemplate -> YourToolName)
 * 2. toolId, toolName 수정
 * 3. formData 구조 정의
 * 4. inputComponent 구현
 * 5. outputComponent 구현
 * 6. handleGenerate 로직 구현
 */

export default function ToolTemplate() {
  // 1. 상태 관리
  const [formData, setFormData] = useState({
    // TODO: 필요한 입력 필드 정의
    field1: '',
    field2: '',
    // ...
  });

  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. 생성 핸들러
  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      // TODO: 실제 AI 생성 로직 구현
      // 예시: API 호출
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   body: JSON.stringify(formData),
      // });
      // const result = await response.json();
      // setOutput(result.data);

      // 임시 샘플 (개발 중)
      setTimeout(() => {
        setOutput(`생성된 결과:\n${JSON.stringify(formData, null, 2)}`);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('생성 중 오류:', error);
      setIsLoading(false);
    }
  };

  // 3. 저장 핸들러
  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    if (!output) return;

    switch (type) {
      case 'download':
        // TODO: 파일 다운로드 로직
        console.log('다운로드:', output);
        break;
      case 'copy':
        // 클립보드에 복사
        navigator.clipboard.writeText(output);
        alert('클립보드에 복사되었습니다.');
        break;
      case 'archive':
        // TODO: 자료함 저장 로직
        console.log('자료함 저장:', output);
        break;
    }
  };

  // 4. 폼 유효성 검사
  const isFormValid = formData.field1 && formData.field2;
  // TODO: 실제 유효성 검사 로직 구현

  // 5. 입력 영역 컴포넌트
  const inputComponent = (
    <div className="space-y-6">
      {/* TODO: 실제 입력 필드 구현 */}

      {/* 예시: 텍스트 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          필드 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.field1}
          onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="입력하세요"
        />
      </div>

      {/* 예시: 선택 드롭다운 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          필드 2 <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.field2}
          onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">선택하세요</option>
          <option value="option1">옵션 1</option>
          <option value="option2">옵션 2</option>
          <option value="option3">옵션 3</option>
        </select>
      </div>

      {/* 생성 버튼 */}
      <Button
        onClick={handleGenerate}
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        {isLoading ? '생성 중...' : '생성하기'}
      </Button>
    </div>
  );

  // 6. 출력 영역 컴포넌트
  const outputComponent = output ? (
    <div className="prose max-w-none">
      {/* TODO: 실제 결과 표시 UI 구현 */}
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
        {output}
      </pre>
    </div>
  ) : (
    <div className="text-center text-gray-500 py-12">
      왼쪽에서 정보를 입력하고 '생성하기' 버튼을 클릭하세요.
    </div>
  );

  // 7. 레이아웃 렌더링
  return (
    <ToolExecutionLayout
      toolId="tool-template" // TODO: 실제 도구 ID로 변경
      toolName="도구 템플릿" // TODO: 실제 도구 이름으로 변경
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
}
