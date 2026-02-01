# 이리사 종합 분석기

> "그래서 그랬구나!" - 수업 산출물 종합 분석 도구

교사를 위한 AI 기반 수업 산출물 종합 분석 플랫폼입니다. 학생의 풀이 과정과 심리정서 검사를 종합 분석하여 상담과 생기부 작성에 활용할 수 있는 인사이트를 제공합니다.

## 이 제품으로 할 수 있는 것

### 하나의 분석 문서로 세 가지 목표 달성

**1. 학생에 대한 깊은 이해**
- 학습 과정과 정서 상태를 통합적으로 파악
- 결과가 아닌 과정 중심의 인사이트 확보
- 학생의 강점과 성장 영역을 명확하게 이해

**2. 효과적인 상담 진행**
- 학생용: 눈높이에 맞춘 격려와 동기부여 멘트 제공
- 학부모용: 가정에서 실천 가능한 구체적 지원 방법 안내
- 팩트 기반 상담으로 신뢰도 향상

**3. 생활기록부 즉시 작성**
- 학습 코칭 의견과 정서 코칭 의견 자동 생성
- 생기부 작성 기준에 맞춘 문장 제공
- 30분 걸리던 작업을 5분 이내로 단축

## 기술 스택 (teacher-platform와 동일)

- **Frontend**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Backend (Mock)**: Node.js + Express

## 시작하기

### 1) 의존성 설치

```bash
cd tools/irisa-analyzer
npm install
```

### 2) 환경 변수 (선택)

목업 API 서버를 연결하려면 다음을 사용합니다:

```bash
cp .env.example .env
```

```text
VITE_API_BASE=http://localhost:5174
```

환경 변수를 설정하지 않으면 **프론트에서 목업 결과를 직접 생성**합니다.

### 3) 개발 서버 실행

```bash
# 백엔드 목업 서버
npm run dev:api

# 프론트엔드
npm run dev
```

## 사용 방법 (UX 기준)

1) 분석 대상 선택 (학생 1명 / 여러 명)
2) 학생 기본 정보 입력 (이름/순번/학년/학교급)
3) 자료 업로드 (영상/PDF/이미지/엑셀 혼합 가능)
4) 자료-학생 매핑 확인 (현재 목업 단계)
5) 기준 문서 입력 (선택)
6) 분석 생성

## 프로젝트 구조

```
irisa-analyzer/
├── server/                 # 목업 API 서버
│   └── index.js
├── src/
│   ├── components/         # UI 컴포넌트
│   ├── lib/                # 목업/유틸
│   ├── types/              # 타입 정의
│   ├── IrisaAnalyzerPage.tsx
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── .env.example
├── package.json
└── README.md
```

## 프롬프트 관리

AI 프롬프트는 다음 경로에 추가 예정입니다:

```
shell/tools/P1_prompt_spec.md
```

## 배포

- 이 서비스는 **teacher-platform 내부 라우팅**으로 연결됩니다.
- 운영 배포는 **Vercel 프로젝트 `shell2`** 기준을 따릅니다.
- 자세한 규칙은 `teacher-platform/DEPLOYMENT_GUIDE.md` 참고.

## 전체 원칙 (2026-02-01)

**분석의 최소 단위는 항상 ‘학생 1명(Student Atomic Unit)’**

- 파일이 몇 개이든
- 한 파일에 학생이 몇 명이든
- 자료 형식이 무엇이든

모든 분석은 반드시 학생 단위로 분해된 이후 수행됩니다.

---

문의사항은 이슈로 남겨주세요.
