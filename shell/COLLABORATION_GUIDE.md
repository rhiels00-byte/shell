# 협업 가이드

## 프로젝트 구조

```
shell/
├── teacher-platform/          # 플랫폼 코어 (1명이 관리)
│   ├── src/
│   │   ├── components/       # 공용 컴포넌트
│   │   │   ├── common/       # Button, Card, Input 등
│   │   │   └── layout/       # MainLayout, ToolExecutionLayout 등
│   │   ├── pages/            # 메인 페이지들
│   │   ├── types/            # TypeScript 타입 정의
│   │   └── App.tsx           # 라우팅 설정
│   ├── tools-config.json     # 도구 레지스트리
│   └── package.json
│
├── tools/                     # 도구들 (각 팀원이 개별 관리)
│   ├── tool-expected-questions/  # 팀원A
│   │   ├── src/
│   │   │   └── ExpectedQuestionsGenerator.tsx
│   │   ├── package.json
│   │   ├── README.md
│   │   └── PRD.md
│   │
│   ├── tool-quiz-generator/      # 팀원B
│   │   ├── src/
│   │   │   └── QuizGenerator.tsx
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── tool-worksheet-generator/ # 팀원C
│       ├── src/
│       │   └── WorksheetGenerator.tsx
│       ├── package.json
│       └── README.md
│
└── PRD_교사지원플랫폼.md      # 전체 플랫폼 PRD
```

## 역할 분담

### 플랫폼 관리자 (1명)
**담당**: `teacher-platform/` 폴더

**책임**:
- 공용 컴포넌트 관리 (Button, Card, Input, ToolExecutionLayout 등)
- 라우팅 시스템 관리
- 레이아웃 및 디자인 시스템 유지
- `tools-config.json` 업데이트 (새 도구 등록)
- 플랫폼 빌드 및 배포

**주요 파일**:
- `src/components/common/` - 공용 UI 컴포넌트
- `src/components/layout/` - 레이아웃 컴포넌트
- `src/App.tsx` - 라우팅 설정
- `tools-config.json` - 도구 레지스트리
- `tailwind.config.js` - 디자인 시스템

### 도구 개발자 (여러 명)
**담당**: `tools/tool-{이름}/` 개별 폴더

**책임**:
- 자신이 담당한 도구 개발
- 도구별 입력 폼 구현
- 도구별 결과 표시 구현
- 도구별 PRD 문서 작성
- 도구 단위 테스트

**예시**:
- **팀원A**: `tools/tool-expected-questions/`
- **팀원B**: `tools/tool-quiz-generator/`
- **팀원C**: `tools/tool-worksheet-generator/`

## 협업 워크플로우

### 1. 새 도구 추가하기

#### Step 1: 플랫폼 관리자에게 요청
도구 개발자가 플랫폼 관리자에게 새 도구 정보 전달:
```json
{
  "id": "my-new-tool",
  "name": "내 새로운 도구",
  "description": "도구 설명",
  "icon": "📝",
  "category": "create",
  "author": "팀원D"
}
```

#### Step 2: 플랫폼 관리자 작업
1. `tools-config.json`에 도구 등록
2. `teacher-platform/src/App.tsx`에 라우트 추가
3. Git push

#### Step 3: 도구 개발자 작업
1. Git pull로 최신 코드 받기
2. `tools/tool-my-new-tool/` 폴더 생성
3. 도구 개발
4. Git push

### 2. 도구 개발 가이드

#### 폴더 구조 생성
```bash
mkdir -p tools/tool-{도구이름}/src
cd tools/tool-{도구이름}
```

#### package.json 생성
```json
{
  "name": "tool-{도구이름}",
  "version": "1.0.0",
  "description": "도구 설명",
  "type": "module",
  "author": "팀원 이름",
  "license": "MIT",
  "main": "src/{ComponentName}.tsx",
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.1"
  }
}
```

#### 컴포넌트 작성 템플릿
```typescript
import { useState } from 'react';
import ToolExecutionLayout from '../../../teacher-platform/src/components/layout/ToolExecutionLayout';
import Button from '../../../teacher-platform/src/components/common/Button';

export default function MyToolName() {
  const [formData, setFormData] = useState({
    // 입력 필드들
  });

  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // AI 생성 로직
    setIsLoading(false);
  };

  const handleSave = (type: 'download' | 'copy' | 'archive') => {
    // 저장 로직
  };

  const inputComponent = (
    <div className="space-y-6">
      {/* 입력 폼 구현 */}
      <Button onClick={handleGenerate} disabled={isLoading}>
        생성하기
      </Button>
    </div>
  );

  const outputComponent = output ? (
    <div>{/* 결과 표시 */}</div>
  ) : (
    <div className="text-center text-gray-500 py-12">
      왼쪽에서 정보를 입력하고 생성 버튼을 클릭하세요.
    </div>
  );

  return (
    <ToolExecutionLayout
      toolId="my-tool-id"
      toolName="내 도구 이름"
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
}
```

### 3. Git 브랜치 전략

#### 플랫폼 관리자
```bash
git checkout -b feature/platform-update
# 플랫폼 코어 수정
git add teacher-platform/
git commit -m "feat: update platform core"
git push origin feature/platform-update
```

#### 도구 개발자
```bash
git checkout -b feature/tool-{도구이름}
# 도구 개발
git add tools/tool-{도구이름}/
git commit -m "feat: add {도구이름} tool"
git push origin feature/tool-{도구이름}
```

### 4. 개발 및 테스트

#### 로컬 개발 서버 실행
```bash
cd teacher-platform
npm run dev
```

브라우저에서 `http://localhost:5173/tool/{도구-id}` 접속

#### 빌드 테스트
```bash
cd teacher-platform
npm run build
```

### 5. 배포

#### 자동 배포 (Vercel)
- `main` 브랜치에 push하면 자동 배포
- PR 생성 시 미리보기 배포 자동 생성

#### 수동 배포
```bash
cd teacher-platform
npm run build
# Vercel CLI로 배포
vercel --prod
```

## 개발 규칙

### 1. TypeScript 타입 Import
```typescript
// ✅ 올바른 방법
import type { Tool } from '../types';

// ❌ 잘못된 방법
import { Tool } from '../types';
```

### 2. 공용 컴포넌트 사용
플랫폼의 공용 컴포넌트를 최대한 활용:
```typescript
import Button from '../../../teacher-platform/src/components/common/Button';
import Card from '../../../teacher-platform/src/components/common/Card';
import ToolExecutionLayout from '../../../teacher-platform/src/components/layout/ToolExecutionLayout';
```

### 3. 디자인 시스템 준수
Tailwind CSS 클래스 사용:
```typescript
// Primary color
className="bg-primary-500 text-white"

// Border radius
className="rounded-lg"  // 12px
className="rounded-xl"  // 20px
```

### 4. 필수 Props
ToolExecutionLayout 사용 시 필수 props:
- `toolId`: 도구 고유 ID
- `toolName`: 도구 이름
- `inputComponent`: 입력 영역 컴포넌트
- `outputComponent`: 출력 영역 컴포넌트
- `onSave`: 저장 핸들러
- `isLoading`: 로딩 상태 (선택)

## 참고 자료

### 예제 도구
완전히 구현된 도구 예제:
- [tools/tool-expected-questions/](tools/tool-expected-questions/)

템플릿 도구 (구현 필요):
- [tools/tool-quiz-generator/](tools/tool-quiz-generator/)
- [tools/tool-worksheet-generator/](tools/tool-worksheet-generator/)

### 문서
- [PRD_교사지원플랫폼.md](PRD_교사지원플랫폼.md) - 전체 플랫폼 요구사항
- [teacher-platform/README.md](teacher-platform/README.md) - 플랫폼 기술 문서
- 각 도구의 `README.md` - 도구별 개발 가이드

## FAQ

### Q1: 도구에서 공용 컴포넌트 수정이 필요할 때는?
**A**: 플랫폼 관리자에게 요청. 여러 도구에 영향을 주므로 신중하게 검토 후 수정.

### Q2: 도구 간에 코드를 공유하고 싶을 때는?
**A**: 공용 유틸리티는 `teacher-platform/src/utils/`에 추가 요청. 플랫폼 관리자가 검토 후 추가.

### Q3: 빌드 에러가 발생하면?
**A**:
1. `verbatimModuleSyntax` 에러: 타입 import를 `import type`으로 변경
2. 경로 에러: 상대 경로 확인 (`../../../teacher-platform/...`)
3. 그 외: 플랫폼 관리자에게 문의

### Q4: 새로운 npm 패키지가 필요할 때는?
**A**:
- 도구 전용 패키지: 각자 도구의 `package.json`에 추가
- 공용 패키지: 플랫폼 관리자에게 요청하여 `teacher-platform/package.json`에 추가

### Q5: 도구를 비활성화하고 싶을 때는?
**A**: `tools-config.json`에서 `"enabled": false`로 설정 (플랫폼 관리자에게 요청)

## 연락처

- **플랫폼 관리자**: [연락처]
- **팀원A (예상질문)**: [연락처]
- **팀원B (퀴즈생성)**: [연락처]
- **팀원C (학습지생성)**: [연락처]

---

**마지막 업데이트**: 2026-01-30
