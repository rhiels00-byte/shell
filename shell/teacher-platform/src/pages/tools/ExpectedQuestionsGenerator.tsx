import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolExecutionLayout from '../../components/layout/ToolExecutionLayout';
import Button from '../../components/common/Button';

interface FormData {
  grade: string;
  subject: string;
  concept: string;
  studentCharacteristics: string;
  explanationType: {
    text: boolean;
    image: boolean;
    youtubeLink: boolean;
    multipleChoice: boolean;
  };
}

interface QuestionAnswer {
  questionNumber: number;
  question: string;
  answer: string;
  additionalExplanation: string;
  imageUrl?: string;
  youtubeLink?: string;
  multipleChoice?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

interface GenerateQuestionsResponse {
  id: string;
  createdAt: string;
  inputSummary: {
    grade?: string;
    subject?: string;
    concept: string;
    studentCharacteristics?: string;
  };
  conceptExplanation: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  questions: string[];
  answers: QuestionAnswer[];
}

export default function ExpectedQuestionsGenerator() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyPrompt, setModifyPrompt] = useState('');

  const [formData, setFormData] = useState<FormData>({
    grade: '',
    subject: '',
    concept: '',
    studentCharacteristics: '',
    explanationType: {
      text: true,
      image: false,
      youtubeLink: false,
      multipleChoice: false,
    },
  });

  const [result, setResult] = useState<GenerateQuestionsResponse | null>(null);

  const handleGenerate = () => {
    if (!formData.concept.trim()) {
      alert('개념을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    // 시뮬레이션: 3초 후 결과 생성
    setTimeout(() => {
      const mockResult: GenerateQuestionsResponse = {
        id: 'eq_' + Date.now(),
        createdAt: new Date().toISOString(),
        inputSummary: {
          grade: formData.grade || undefined,
          subject: formData.subject || undefined,
          concept: formData.concept,
          studentCharacteristics: formData.studentCharacteristics || undefined,
        },
        conceptExplanation: {
          title: `${formData.concept}란?`,
          description: `${formData.concept}는 ${formData.subject || '해당 과목'}에서 중요한 개념입니다. 이 개념을 이해하면 관련된 다른 개념들도 쉽게 이해할 수 있습니다.`,
          keyPoints: [
            '핵심 포인트 1: 기본 정의와 의미',
            '핵심 포인트 2: 실생활 적용 예시',
            '핵심 포인트 3: 주의해야 할 점',
          ],
        },
        questions: [
          `${formData.concept}는 왜 배워야 하나요?`,
          `${formData.concept}의 핵심 개념은 무엇인가요?`,
          `${formData.concept}를 실생활에서 어떻게 사용하나요?`,
          `${formData.concept}와 비슷한 다른 개념은 무엇인가요?`,
          `${formData.concept}를 쉽게 이해하는 방법이 있나요?`,
        ],
        answers: [
          {
            questionNumber: 1,
            question: `${formData.concept}는 왜 배워야 하나요?`,
            answer: `${formData.concept}는 ${formData.subject || '이 과목'}의 기초가 되는 중요한 개념입니다. 이를 이해하면 더 복잡한 내용도 쉽게 이해할 수 있습니다.`,
            additionalExplanation: '학생들에게 설명할 때는 실생활 예시를 들어 설명하면 좋습니다.',
            youtubeLink: formData.explanationType.youtubeLink
              ? '관련 유튜브 영상 검색 키워드: ' + formData.concept
              : undefined,
          },
          {
            questionNumber: 2,
            question: `${formData.concept}의 핵심 개념은 무엇인가요?`,
            answer: '핵심 개념은 기본 원리를 이해하고 적용하는 것입니다.',
            additionalExplanation: '다이어그램이나 도표를 활용하면 이해가 쉽습니다.',
          },
          {
            questionNumber: 3,
            question: `${formData.concept}를 실생활에서 어떻게 사용하나요?`,
            answer: '우리 주변에서 흔히 볼 수 있는 여러 상황에 적용됩니다.',
            additionalExplanation: '구체적인 사례를 들어 설명하는 것이 효과적입니다.',
          },
          {
            questionNumber: 4,
            question: `${formData.concept}와 비슷한 다른 개념은 무엇인가요?`,
            answer: '관련된 개념들을 함께 이해하면 전체적인 그림을 파악할 수 있습니다.',
            additionalExplanation: '비교표를 만들어 설명하면 좋습니다.',
          },
          {
            questionNumber: 5,
            question: `${formData.concept}를 쉽게 이해하는 방법이 있나요?`,
            answer: '단계별로 나누어 학습하고, 충분한 연습 문제를 풀어보는 것이 좋습니다.',
            additionalExplanation: '학생들의 수준에 맞춘 예시를 준비하세요.',
            multipleChoice: formData.explanationType.multipleChoice
              ? {
                  question: `다음 중 ${formData.concept}에 대한 설명으로 옳은 것은?`,
                  options: [
                    '옵션 1: 설명 A',
                    '옵션 2: 설명 B (정답)',
                    '옵션 3: 설명 C',
                    '옵션 4: 설명 D',
                  ],
                  correctAnswer: 1,
                  explanation: '정답은 2번입니다. 왜냐하면...',
                }
              : undefined,
          },
        ],
      };

      setResult(mockResult);
      setIsLoading(false);
      setIsModifyMode(true);
    }, 3000);
  };

  const handleModify = () => {
    if (!modifyPrompt.trim()) {
      alert('수정 요청 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      alert('수정이 반영되었습니다 (시뮬레이션)');
      setIsLoading(false);
      setModifyPrompt('');
    }, 2000);
  };

  const handleNewGeneration = () => {
    setResult(null);
    setIsModifyMode(false);
    setModifyPrompt('');
    setFormData({
      grade: '',
      subject: '',
      concept: '',
      studentCharacteristics: '',
      explanationType: {
        text: true,
        image: false,
        youtubeLink: false,
        multipleChoice: false,
      },
    });
  };

  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    if (!result) {
      alert('생성된 결과가 없습니다.');
      return;
    }

    switch (type) {
      case 'download':
        alert(`Word 파일 다운로드 (구현 예정)\n파일명: 예상질문_${formData.concept}_${new Date().toISOString().split('T')[0]}.docx`);
        break;
      case 'copy':
        const textContent = `
# ${formData.concept} 예상 질문 리스트

## 1. 수업 정보
- 학급: ${result.inputSummary.grade || '미지정'}
- 과목: ${result.inputSummary.subject || '미지정'}
- 개념: ${result.inputSummary.concept}
- 학생 특징: ${result.inputSummary.studentCharacteristics || '없음'}

## 2. 개념 설명
${result.conceptExplanation.description}

핵심 포인트:
${result.conceptExplanation.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

## 3. 예상 질문
${result.questions.map((q, i) => `Q${i + 1}. ${q}`).join('\n')}

## 4. 답변
${result.answers.map(a => `
Q${a.questionNumber}. ${a.question}
답변: ${a.answer}
부연 설명: ${a.additionalExplanation}
`).join('\n')}
        `;
        navigator.clipboard.writeText(textContent);
        alert('클립보드에 복사되었습니다!');
        break;
      case 'archive':
        alert('만든 자료함에 저장되었습니다!');
        setTimeout(() => navigate('/materials'), 1000);
        break;
    }
  };

  // 입력 컴포넌트
  const InputComponent = !isModifyMode ? (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <strong>사용 방법:</strong> 왼쪽에 정보를 입력하면, 오른쪽에서 내용을 미리보기 할 수 있어요.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          학급 (선택)
        </label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
        >
          <option value="">학급을 선택하세요</option>
          <option value="중등1">중등1</option>
          <option value="중등2">중등2</option>
          <option value="중등3">중등3</option>
          <option value="고등1">고등1</option>
          <option value="고등2">고등2</option>
          <option value="고등3">고등3</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          과목 (선택)
        </label>
        <select
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
        >
          <option value="">과목을 선택하세요</option>
          <option value="영어">영어</option>
          <option value="수학">수학</option>
          <option value="과학">과학</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          개념 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="예: 소인수분해"
          value={formData.concept}
          onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          학생 특징 (선택)
        </label>
        <textarea
          value={formData.studentCharacteristics}
          onChange={(e) =>
            setFormData({ ...formData, studentCharacteristics: e.target.value })
          }
          placeholder="예: 오늘 소인수분해 공부를 2번째 하였음"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          설명 형식 (선택)
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.explanationType.text}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  explanationType: {
                    ...formData.explanationType,
                    text: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">텍스트</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.explanationType.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  explanationType: {
                    ...formData.explanationType,
                    image: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">이미지</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.explanationType.youtubeLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  explanationType: {
                    ...formData.explanationType,
                    youtubeLink: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">유튜브 연관 영상 링크</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.explanationType.multipleChoice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  explanationType: {
                    ...formData.explanationType,
                    multipleChoice: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">4지선다 문항</span>
          </label>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        className="w-full mt-6"
        disabled={!formData.concept.trim() || isLoading}
      >
        {isLoading ? '생성 중...' : '🚀 생성하기'}
      </Button>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-green-800 font-medium">
          ✅ 생성 완료! 결과를 확인하세요.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          ✏️ 결과 수정하기
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            추가 요청사항
          </label>
          <textarea
            value={modifyPrompt}
            onChange={(e) => setModifyPrompt(e.target.value)}
            placeholder="예: 질문을 더 쉽게 만들어주세요"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:outline-none resize-none"
            rows={3}
          />
        </div>

        <Button
          onClick={handleModify}
          className="w-full mt-4"
          disabled={isLoading}
          variant="secondary"
        >
          🔄 다시 생성
        </Button>

        <Button
          onClick={handleNewGeneration}
          className="w-full mt-3"
          variant="outline"
        >
          🆕 새로 만들기
        </Button>
      </div>
    </div>
  );

  // 출력 컴포넌트
  const OutputComponent = !result ? (
    <div className="text-center py-20 text-gray-500">
      <div className="text-6xl mb-4">📝</div>
      <p className="text-lg mb-2">왼쪽에서 정보를 입력하고</p>
      <p className="text-lg mb-2">[생성하기] 버튼을 눌러주세요</p>
      <p className="text-sm mt-4">예상 질문 리스트가 이곳에 표시됩니다.</p>
    </div>
  ) : (
    <div className="space-y-6">
      {/* 섹션 1: 입력 정보 요약 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          📋 1. 수업 정보
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">학급:</span>{' '}
            <span className="text-gray-900">
              {result.inputSummary.grade || '미지정'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">과목:</span>{' '}
            <span className="text-gray-900">
              {result.inputSummary.subject || '미지정'}
            </span>
          </div>
          <div className="col-span-2">
            <span className="font-medium text-gray-700">개념:</span>{' '}
            <span className="text-gray-900">{result.inputSummary.concept}</span>
          </div>
          {result.inputSummary.studentCharacteristics && (
            <div className="col-span-2">
              <span className="font-medium text-gray-700">학생 특징:</span>{' '}
              <span className="text-gray-900">
                {result.inputSummary.studentCharacteristics}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 섹션 2: 개념 상세 설명 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
          📖 2. 개념 설명
        </h3>
        <h4 className="font-semibold text-gray-900 mb-2">
          {result.conceptExplanation.title}
        </h4>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {result.conceptExplanation.description}
        </p>
        <ul className="space-y-2">
          {result.conceptExplanation.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="text-primary-500">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 섹션 3: 예상 질문 리스트 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          ❓ 3. 예상 질문 리스트 ({result.questions.length}개)
        </h3>
        <ol className="space-y-2">
          {result.questions.map((question, i) => (
            <li key={i} className="text-gray-800">
              <span className="font-medium">Q{i + 1}.</span> {question}
            </li>
          ))}
        </ol>
      </div>

      {/* 섹션 4: 질문별 답변 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          💡 4. 질문별 답변 및 부연 설명
        </h3>

        {result.answers.map((answer, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Q{answer.questionNumber}. {answer.question}
            </h4>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-green-700 mb-1">
                  ✅ 답변
                </div>
                <p className="text-gray-800 leading-relaxed">{answer.answer}</p>
              </div>

              <div>
                <div className="text-sm font-medium text-blue-700 mb-1">
                  📝 부연 설명
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {answer.additionalExplanation}
                </p>
              </div>

              {answer.youtubeLink && (
                <div>
                  <div className="text-sm font-medium text-red-700 mb-1">
                    🎥 유튜브 영상
                  </div>
                  <p className="text-gray-700">{answer.youtubeLink}</p>
                </div>
              )}

              {answer.multipleChoice && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-700 mb-2">
                    ✏️ 4지선다 문항
                  </div>
                  <p className="font-medium text-gray-900 mb-3">
                    {answer.multipleChoice.question}
                  </p>
                  <ol className="space-y-2 mb-3">
                    {answer.multipleChoice.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`text-sm ${
                          idx === answer.multipleChoice!.correctAnswer
                            ? 'font-medium text-green-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {idx + 1}. {option}
                        {idx === answer.multipleChoice!.correctAnswer && ' ✓'}
                      </li>
                    ))}
                  </ol>
                  <p className="text-sm text-gray-600">
                    {answer.multipleChoice.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ToolExecutionLayout
      toolId="expected-questions-generator"
      toolName="예상 질문 리스트 만들기"
      inputComponent={InputComponent}
      outputComponent={OutputComponent}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
}
