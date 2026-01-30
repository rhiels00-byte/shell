# 협업 구조 재구성 완료

## 업데이트 일시
2026년 1월 30일

## 변경 사항 요약

교사 지원 플랫폼을 **여러 명이 협업 가능한 구조**로 재구성했습니다.
- 1명: 플랫폼 코어 관리
- 여러 명: 각자 도구 개발

## 새로운 폴더 구조

```
shell/
├── teacher-platform/          # 플랫폼 코어 (공용, 1명 관리)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Button, Card, Input 등
│   │   │   ├── layout/       # MainLayout, ToolExecutionLayout
│   │   │   └── features/     # ToolTile, ToolGrid
│   │   ├── pages/
│   │   │   ├── tools/        # 통합된 도구 컴포넌트들
│   │   │   │   └── ExpectedQuestionsGenerator.tsx
│   │   │   └── ...
│   │   └── App.tsx
│   ├── tools-config.json      # 도구 레지스트리
│   └── package.json
│
├── tools/                     # 도구 개발 영역 (각자 개발)
│   ├── _template/            # 새 도구 만들 때 사용하는 템플릿
│   │   ├── src/
│   │   │   └── ToolTemplate.tsx
│   │   ├── package.json
│   │   └── README.md
│   │
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
├── COLLABORATION_GUIDE.md    # 협업 가이드 (필독!)
├── RESTRUCTURE_SUMMARY.md    # 이 파일
└── PRD_교사지원플랫폼.md
```

## 주요 개념

### 1. 도구 개발 영역 (`tools/`)
**목적**: 각 개발자가 독립적으로 도구를 개발하는 공간

**특징**:
- 각 도구는 독립적인 폴더
- 독립적인 package.json (의존성 관리)
- 독립적인 README, PRD 문서
- 플랫폼과 **분리되어** 개발 가능

**개발 흐름**:
1. `tools/_template/`을 복사하여 새 도구 폴더 생성
2. 독립적으로 개발 및 테스트
3. 완성 후 플랫폼 관리자에게 통보
4. 플랫폼 관리자가 `teacher-platform/src/pages/tools/`로 통합

### 2. 플랫폼 코어 (`teacher-platform/`)
**목적**: 모든 도구가 공유하는 플랫폼 기능

**포함 사항**:
- 공통 UI 컴포넌트 (Button, Card, Input)
- 레이아웃 (MainLayout, ToolExecutionLayout)
- 라우팅 시스템
- 디자인 시스템 (Tailwind 설정)
- 타입 정의

**플랫폼 관리자 역할**:
- 공용 컴포넌트 유지보수
- 도구 레지스트리 관리 (`tools-config.json`)
- 완성된 도구 통합
- 라우팅 설정
- 빌드 및 배포

### 3. 도구 레지스트리 (`tools-config.json`)
도구 메타데이터를 중앙에서 관리:

```json
{
  "version": "1.0.0",
  "tools": [
    {
      "id": "expected-questions-generator",
      "name": "예상 질문 리스트 만들기",
      "description": "학생들이 물어볼만한 예상 질문과 답변을 생성합니다",
      "icon": "❓",
      "category": "create",
      "version": "1.0.0",
      "author": "팀원A",
      "enabled": true,
      "path": "../tools/tool-expected-questions",
      "component": "ExpectedQuestionsGenerator",
      "route": "/tool/expected-questions-generator"
    }
  ]
}
```

## 협업 워크플로우

### 도구 개발자 워크플로우

1. **새 도구 시작하기**
   ```bash
   # 템플릿 복사
   cp -r tools/_template tools/tool-{새도구이름}
   cd tools/tool-{새도구이름}

   # package.json 수정 (이름, 설명, author)
   # PRD 문서 작성
   ```

2. **도구 개발**
   - `src/` 폴더에서 컴포넌트 개발
   - 플랫폼의 공통 컴포넌트 사용
   - ToolExecutionLayout 사용 권장

3. **완성 후 통보**
   - 플랫폼 관리자에게 완성 통보
   - 도구 정보 전달 (id, name, description, icon, category)

### 플랫폼 관리자 워크플로우

1. **도구 레지스트리 등록**
   - `tools-config.json`에 새 도구 추가

2. **도구 통합**
   ```bash
   # 완성된 도구를 플랫폼으로 복사
   cp tools/tool-{도구이름}/src/{Component}.tsx \
      teacher-platform/src/pages/tools/
   ```

3. **라우팅 추가**
   - `teacher-platform/src/App.tsx`에 라우트 추가
   ```typescript
   import NewTool from './pages/tools/NewTool';

   // 라우트 추가
   <Route path="/tool/new-tool" element={<NewTool />} />
   ```

4. **빌드 및 배포**
   ```bash
   cd teacher-platform
   npm run build
   git add .
   git commit -m "feat: add new-tool"
   git push
   ```

## 생성된 파일 목록

### 새로 추가된 파일

1. **협업 가이드**
   - `COLLABORATION_GUIDE.md` - 상세한 협업 가이드 (필독!)
   - `RESTRUCTURE_SUMMARY.md` - 이 파일

2. **도구 템플릿**
   - `tools/_template/package.json`
   - `tools/_template/README.md`
   - `tools/_template/src/ToolTemplate.tsx`

3. **예시 도구 (tool-expected-questions)**
   - `tools/tool-expected-questions/package.json`
   - `tools/tool-expected-questions/README.md`
   - `tools/tool-expected-questions/PRD.md`
   - `tools/tool-expected-questions/src/ExpectedQuestionsGenerator.tsx`

4. **템플릿 도구 (quiz-generator, worksheet-generator)**
   - `tools/tool-quiz-generator/*` - 퀴즈 생성기 템플릿
   - `tools/tool-worksheet-generator/*` - 학습지 생성기 템플릿

5. **도구 레지스트리**
   - `teacher-platform/tools-config.json`

### 수정된 파일

1. `teacher-platform/README.md`
   - 협업 구조 설명 추가
   - 새로운 폴더 구조 반영

2. `teacher-platform/tsconfig.app.json`
   - tools 폴더 제외 설정 추가

## 도구 개발 가이드

### 필수 규칙

1. **타입 Import**
   ```typescript
   // ✅ 올바른 방법
   import type { Tool } from '../types';

   // ❌ 잘못된 방법
   import { Tool } from '../types';
   ```

2. **공용 컴포넌트 사용**
   ```typescript
   import ToolExecutionLayout from '../../../teacher-platform/src/components/layout/ToolExecutionLayout';
   import Button from '../../../teacher-platform/src/components/common/Button';
   ```

3. **ToolExecutionLayout 사용**
   - 모든 도구는 ToolExecutionLayout 사용 권장
   - 일관된 2단 레이아웃 제공
   - 자동 저장 옵션 제공

### 템플릿 사용법

1. **템플릿 복사**
   ```bash
   cp -r tools/_template tools/tool-my-new-tool
   ```

2. **package.json 수정**
   - name: "tool-my-new-tool"
   - description: 도구 설명
   - author: 본인 이름
   - main: "src/MyNewTool.tsx"

3. **컴포넌트 파일 이름 변경**
   ```bash
   mv src/ToolTemplate.tsx src/MyNewTool.tsx
   ```

4. **컴포넌트 내용 수정**
   - 컴포넌트 이름 변경
   - toolId, toolName 수정
   - formData 구조 정의
   - inputComponent 구현
   - outputComponent 구현

## Git 브랜치 전략

### 도구 개발자
```bash
# 본인의 도구 브랜치 생성
git checkout -b feature/tool-{도구이름}

# 도구 폴더만 add
git add tools/tool-{도구이름}/

# 커밋
git commit -m "feat: add {도구이름} tool"

# Push
git push origin feature/tool-{도구이름}

# Pull Request 생성
```

### 플랫폼 관리자
```bash
# 플랫폼 코어 수정 브랜치
git checkout -b feature/platform-update

# 변경사항 add
git add teacher-platform/

# 커밋
git commit -m "feat: integrate {도구이름} and update platform"

# Push 및 PR
git push origin feature/platform-update
```

## 테스트 방법

### 독립 도구 테스트
각 도구는 플랫폼 없이 독립적으로 테스트하기 어렵습니다.
플랫폼과 함께 테스트하세요:

```bash
cd teacher-platform
npm run dev
```

브라우저: `http://localhost:5173/tool/{도구-id}`

### 빌드 테스트
```bash
cd teacher-platform
npm run build
```

## 배포

- **자동 배포**: main 브랜치에 push하면 Vercel이 자동 배포
- **미리보기**: PR 생성 시 자동으로 미리보기 URL 생성

## FAQ

### Q: 도구 폴더에서 npm install이 필요한가요?
**A**: 아니요. 도구는 플랫폼의 의존성을 사용합니다. package.json은 메타데이터용입니다.

### Q: 도구를 어떻게 테스트하나요?
**A**: teacher-platform에서 `npm run dev`로 전체 플랫폼을 실행하여 테스트합니다.

### Q: 공용 컴포넌트를 수정하고 싶어요.
**A**: 플랫폼 관리자에게 요청하세요. 여러 도구에 영향을 주므로 신중하게 검토 후 수정됩니다.

### Q: 도구 개발 중 플랫폼 업데이트가 있으면?
**A**: `git pull`로 최신 코드를 받으면 됩니다. 공용 컴포넌트 변경 사항이 있을 수 있으니 주의하세요.

### Q: 완성된 도구는 어떻게 통합되나요?
**A**: 플랫폼 관리자가 `tools/tool-{이름}`에서 `teacher-platform/src/pages/tools/`로 복사하여 통합합니다.

## 참고 문서

1. [COLLABORATION_GUIDE.md](./COLLABORATION_GUIDE.md) - 상세한 협업 가이드
2. [teacher-platform/README.md](./teacher-platform/README.md) - 플랫폼 기술 문서
3. [PRD_교사지원플랫폼.md](./PRD_교사지원플랫폼.md) - 전체 PRD
4. `tools/_template/README.md` - 템플릿 사용법
5. `tools/tool-expected-questions/README.md` - 완성된 도구 예시

## 다음 단계

### 도구 개발자들
1. `COLLABORATION_GUIDE.md` 읽기 (필수!)
2. `tools/_template/` 참고하여 새 도구 만들기
3. `tools/tool-expected-questions/` 참고하여 구조 이해
4. 도구 개발 시작

### 플랫폼 관리자
1. 도구 개발자들에게 가이드 공유
2. 새 도구 요청 받으면 `tools-config.json` 업데이트
3. 완성된 도구 통합 및 배포

---

**구조 재구성 완료!** 🚀

이제 여러 명이 효율적으로 협업할 수 있는 구조가 마련되었습니다.
