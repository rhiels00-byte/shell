# 이리사 종합 분석기

> "그래서 그랬구나!" - 수업 산출물 종합 분석 도구

교사를 위한 AI 기반 수업 산출물 종합 분석 플랫폼입니다. 학생의 풀이 과정과 심리정서 검사를 종합 분석하여 상담과 생기부 작성에 활용할 수 있는 인사이트를 제공합니다.

## 핵심 UX 규칙 (요약)

- **학생 인원 수 선택 → 학생 기본 정보 입력 방식이 달라짐**
  - 학생 1명: 입력 1줄
  - 학생 여러 명: 테이블형 입력 + 추가/삭제
- 학년/학교급은 **공통 정보(같은 반 기준)**
- 파일 업로드는 **누적(append)** 방식
- 분석 자료와 기준표는 **각각 다중 업로드** 지원
- 업로드 후 **자료–학생 매핑 확인 단계** 제공

## 기술 스택 (teacher-platform 동일)

- **Frontend**: Vite + React 19 + TypeScript (TSX)
- **Styling**: Tailwind CSS
- **Backend (Mock)**: Node.js + Express
- **DB 설계**: MySQL (schema 포함)

## 로컬 실행

```bash
cd tools/irisa-analyzer
npm install

# 백엔드 목업 서버
npm run dev:api

# 프론트엔드
npm run dev
```

## 프로젝트 구조 (핵심만)

```
irisa-analyzer/
├── prompts/                 # 프롬프트 관리 (스펙 포인터)
│   └── README.md
├── server/                  # 백엔드 (목업)
│   ├── index.js             # API 엔트리
│   ├── routes/              # API 라우트 (설계)
│   ├── services/            # 비즈니스 로직 (설계)
│   ├── storage/             # 업로드/분해/매핑 저장 구조
│   │   └── README.md
│   └── db/                  # MySQL 스키마
│       ├── schema.sql
│       └── README.md
├── src/                     # 프론트엔드 (Vite)
│   ├── components/          # 공통 컴포넌트
│   ├── lib/                 # 목업/유틸
│   ├── types/               # 타입 정의
│   ├── IrisaAnalyzerPage.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── README.md
```

## 프롬프트 관리

- 실제 프롬프트 스펙: `shell/tools/P1_prompt_spec.md`
- 이 폴더(`prompts/`)는 버전 관리용 자리입니다.

## 백엔드 데이터 저장 흐름 (개념)

1. **Raw File (원본)**: `server/storage/uploads/`
2. **Extracted Unit (분해 단위)**: `server/storage/extracted/`
3. **Student Dataset (학생 단위 묶음)**: `server/storage/datasets/`

MySQL 테이블 구조는 `server/db/schema.sql` 참고.

## API (목업)

- `POST /api/analyze` : 분석 실행 (파일 + 입력 데이터)
- `GET /api/download` : 결과 다운로드

## 배포 연결

- 이 서비스는 **teacher-platform 내부 라우팅**(`/tool/irisa-analyzer`)으로 연결됩니다.
- 운영 배포는 **Vercel 프로젝트 `shell2`** 기준입니다.
- 배포 규칙: `teacher-platform/DEPLOYMENT_GUIDE.md`

## 유지보수 가이드

- `node_modules/`, `.next/` 등은 **로컬 산출물**이며 커밋하지 않습니다.
- 공통 레이아웃/스타일은 **teacher-platform ToolExecutionLayout**에 맞추면 됩니다.
- 다른 플랫폼 이식 시:
  - `src/`는 교체 가능한 UI 레이어
  - `server/`는 독립 서비스로 분리 가능
  - `prompts/`와 `db/schema.sql`은 그대로 재사용 가능
