import type { AnalysisResult, InputData } from '../types';

export function createMockResult(input: InputData): AnalysisResult {
  const targetLabel = input.target === 'single' ? '학생 1명' : '학생 여러 명';
  return {
    teacherSummary: `교사용 Fact 분석 (목업)

- 분석 대상: ${targetLabel}
- 학생: ${input.studentName || '미입력'} / ${input.studentNumber || '미입력'}
- 학년/학교급: ${input.grade || '미입력'} / ${input.level}
- 업로드 파일 수: ${input.files.length}개

핵심 관찰
1) 문제 이해 단계에서 시각적 단서를 적극 활용함.
2) 풀이 과정 중 스스로 검증하는 메타인지 활동이 관찰됨.
3) 결과보다 과정 서술이 풍부하여 상담 시 강점으로 활용 가능.

유사 문항 제안
- 난이도 중, 서술형 2문항
- 강화: 계산 정확도 보완용 2문항
`,
    studentSummary: `학생/학부모용 분석 (목업)

- 학습 과정에서 스스로 점검하는 습관이 보여요.
- 실수는 있었지만 해결 전략을 바꿔가며 끝까지 해낸 점이 훌륭해요.
- 집에서는 풀이 과정을 말로 설명해보는 연습이 도움이 됩니다.
`,
    recordGuide: `생기부 작성 가이드 (목업)

학습 코칭 종합 의견
- 문제 해결 과정에서 다양한 전략을 시도하며 자기 점검을 수행함.

심리·정서 코칭 종합 의견
- 실패에 대한 회복 탄력성이 높아 지속적인 도전이 가능함.

통합 소견
- 과정 중심 학습 태도가 안정적으로 형성되어 있음.
`,
    generatedAt: new Date().toISOString(),
  };
}
