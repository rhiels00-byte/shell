# 퀴즈 생성기

## 개요
단원과 난이도에 맞는 퀴즈를 자동으로 생성하는 교사 지원 도구입니다.

## 담당자
팀원B

## 개발 가이드

### 파일 구조
```
tool-quiz-generator/
├── package.json              # 도구 메타데이터
├── PRD.md                    # 도구 요구사항 문서 (작성 필요)
├── README.md                 # 이 파일
└── src/
    └── QuizGenerator.tsx     # 메인 컴포넌트 (구현 필요)
```

### 구현 필요 사항
1. QuizGenerator.tsx 컴포넌트 작성
2. 입력 폼 구현 (과목, 학년, 단원, 난이도 등)
3. 퀴즈 생성 로직 구현
4. 결과 표시 UI 구현

### 플랫폼 연동
- tools-config.json에 등록됨
- 라우트: `/tool/quiz-generator`
- ToolExecutionLayout 사용

### 개발 시작하기
1. PRD 문서 작성
2. src/QuizGenerator.tsx 파일 생성
3. tool-expected-questions 참고하여 구조 구현
4. teacher-platform에서 테스트

### 테스트
```bash
cd ../../teacher-platform
npm run dev
```
브라우저: `http://localhost:5173/tool/quiz-generator`
