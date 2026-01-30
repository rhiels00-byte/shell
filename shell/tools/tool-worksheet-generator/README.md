# 학습지 생성기

## 개요
맞춤형 학습지를 빠르게 제작하는 교사 지원 도구입니다.

## 담당자
팀원C

## 개발 가이드

### 파일 구조
```
tool-worksheet-generator/
├── package.json              # 도구 메타데이터
├── PRD.md                    # 도구 요구사항 문서 (작성 필요)
├── README.md                 # 이 파일
└── src/
    └── WorksheetGenerator.tsx  # 메인 컴포넌트 (구현 필요)
```

### 구현 필요 사항
1. WorksheetGenerator.tsx 컴포넌트 작성
2. 입력 폼 구현 (과목, 학년, 주제, 문제 유형 등)
3. 학습지 생성 로직 구현
4. 결과 표시 및 인쇄 기능 구현

### 플랫폼 연동
- tools-config.json에 등록됨
- 라우트: `/tool/worksheet-generator`
- ToolExecutionLayout 사용

### 개발 시작하기
1. PRD 문서 작성
2. src/WorksheetGenerator.tsx 파일 생성
3. tool-expected-questions 참고하여 구조 구현
4. teacher-platform에서 테스트

### 테스트
```bash
cd ../../teacher-platform
npm run dev
```
브라우저: `http://localhost:5173/tool/worksheet-generator`
