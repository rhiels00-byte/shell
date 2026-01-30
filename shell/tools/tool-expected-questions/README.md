# 예상 질문 리스트 만들기 도구

## 개요
학생들이 물어볼만한 예상 질문과 답변을 생성하는 교사 지원 도구입니다.

## 담당자
팀원A

## 기능
- 학년, 과목, 개념을 기반으로 예상 질문 생성
- 학생 특성에 맞춘 맞춤형 질문 제공
- 다양한 설명 방식 지원 (텍스트, 이미지, 유튜브, 객관식)
- 생성된 질문 수정 및 재생성

## 개발 가이드

### 파일 구조
```
tool-expected-questions/
├── package.json              # 도구 메타데이터
├── PRD.md                    # 도구 요구사항 문서
├── README.md                 # 이 파일
└── src/
    └── ExpectedQuestionsGenerator.tsx  # 메인 컴포넌트
```

### 컴포넌트 구조
- **ExpectedQuestionsGenerator**: 메인 도구 컴포넌트
  - 입력 폼 (학년, 과목, 개념, 학생 특성, 설명 방식)
  - 결과 표시 (입력 요약, 개념 설명, 질문 리스트, 상세 답변)
  - 수정 모드 지원

### 플랫폼 연동
이 도구는 teacher-platform에서 동적으로 로드됩니다.

1. `/shell/teacher-platform/tools-config.json`에 등록되어 있음
2. 플랫폼에서 `/tool/expected-questions-generator` 경로로 접근
3. `ToolExecutionLayout`을 사용하여 2단 레이아웃 제공

### 개발 시 주의사항
- React 18, TypeScript 사용
- 타입 import는 `import type` 구문 사용 (verbatimModuleSyntax)
- 플랫폼의 공통 컴포넌트 사용 (Button, Card 등)
- ToolExecutionLayout props 준수

### 테스트
로컬 환경에서 teacher-platform을 실행하여 테스트:
```bash
cd ../../teacher-platform
npm run dev
```

브라우저에서 `http://localhost:5173/tool/expected-questions-generator` 접속

## 배포
개별 도구는 독립적으로 개발하되, teacher-platform과 함께 배포됩니다.
