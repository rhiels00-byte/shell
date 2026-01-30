# 교사 지원 플랫폼 (Teacher Support Platform)

AI를 활용하여 교사가 원하는 산출물을 빠르고 정확하게 제공하는 교사 지원툴 플랫폼입니다.

## 배포 링크

- **GitHub**: [https://github.com/rhiels00-byte/shell](https://github.com/rhiels00-byte/shell)
- **Vercel**: [https://vercel.com/rhiels00-bytes-projects/shell](https://vercel.com/rhiels00-bytes-projects/shell)
- **배포 가이드**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 프로젝트 개요

이 프로젝트는 교사들의 업무 효율성을 높이기 위해 AI 기반의 다양한 도구를 제공하는 웹 애플리케이션입니다.

### 주요 기능

- **홈 화면**: GPT 스타일의 대화형 프롬프트 입력과 도구 추천
- **도구 페이지**: 생성/분석 도구를 카테고리별로 탐색
- **도구 실행**: 2단 레이아웃(입력+미리보기) 및 저장 옵션
- **채팅 내역**: 도구 사용 시 나눈 대화 기록 관리
- **만든 자료**: 생성된 산출물 저장 및 다운로드
- **설정**: 계정, 학급/과목, 환경 설정 관리
- **인증**: 로그인 및 회원가입

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Hooks (추후 Zustand/Redux 추가 예정)

## 시작하기

### 필수 조건

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 프로젝트 구조

### 전체 구조 (협업 체계)

```
shell/
├── teacher-platform/    # 플랫폼 코어 (공용)
│   ├── src/
│   │   ├── components/  # 공통 컴포넌트
│   │   ├── pages/       # 메인 페이지
│   │   └── App.tsx      # 라우팅 설정
│   └── tools-config.json  # 도구 레지스트리
│
├── tools/               # 도구들 (개별 개발)
│   ├── tool-expected-questions/  # 예상 질문 생성기
│   ├── tool-quiz-generator/      # 퀴즈 생성기
│   ├── tool-worksheet-generator/ # 학습지 생성기
│   └── _template/                # 도구 템플릿
│
└── COLLABORATION_GUIDE.md  # 협업 가이드
```

### 플랫폼 코어 (teacher-platform/)

```
src/
├── components/
│   ├── common/          # 공통 컴포넌트 (Button, Input, Card 등)
│   ├── layout/          # 레이아웃 컴포넌트 (LNB, MainLayout, ToolExecutionLayout)
│   └── features/        # 기능별 컴포넌트 (ToolTile, ToolGrid)
├── pages/               # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── Tools.tsx
│   ├── ChatHistory.tsx
│   ├── Materials.tsx
│   ├── Settings.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── types/               # TypeScript 타입 정의
├── hooks/               # 커스텀 훅
├── services/            # API 서비스
├── stores/              # 상태 관리
├── utils/               # 유틸리티 함수
└── styles/              # 글로벌 스타일
```

## 협업 구조

이 프로젝트는 **1명의 플랫폼 관리자**와 **여러 명의 도구 개발자**가 협업할 수 있도록 설계되었습니다.

- **플랫폼 관리자**: `teacher-platform/` 폴더 관리 (공용 컴포넌트, 레이아웃, 라우팅)
- **도구 개발자**: `tools/tool-{이름}/` 개별 폴더 관리 (각자 담당 도구)

자세한 협업 가이드는 [COLLABORATION_GUIDE.md](../COLLABORATION_GUIDE.md)를 참조하세요.

## 디자인 시스템

### 컬러 팔레트

- **Primary**: Blue (#2196F3)
- **Category Colors**:
  - 생성: Blue (#2196F3)
  - 분석: Green (#4CAF50)

### Border Radius

동글동글한 디자인을 위해 다음과 같은 radius 값을 사용합니다:
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px

## 개발 로드맵

### Phase 1: MVP (현재)
- [x] 기본 레이아웃 및 네비게이션
- [x] 홈 화면 및 프롬프트 입력
- [x] 도구 페이지 (타일 UI)
- [x] 인증 페이지 (로그인/회원가입)
- [x] 채팅 내역, 만든 자료, 설정 페이지
- [x] 도구 실행 화면 레이아웃 (2단 구조)
- [x] 입력 영역 + 미리보기 영역
- [x] 저장 옵션 드롭다운 (다운로드/복사/자료함)

### Phase 2: 백엔드 통합 (예정)
- [ ] API 서버 연동
- [ ] 실제 인증 시스템 구현
- [ ] 데이터베이스 연동
- [ ] AI 도구 실행 로직

### Phase 3: 도구 개발 (예정)
- [ ] 퀴즈 생성기
- [ ] 학습지 생성기
- [ ] 성적 분석기
- [ ] 교안 작성 도우미
- [ ] QR 코드 생성기

### Phase 4: 고도화 (예정)
- [ ] 실시간 채팅
- [ ] 파일 업로드
- [ ] 음성 입력
- [ ] 다크 모드
- [ ] 성능 최적화

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 문서

자세한 요구사항은 [PRD_교사지원플랫폼.md](./PRD_교사지원플랫폼.md)를 참조하세요.
