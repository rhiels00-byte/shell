# 🎯 도구 PRD: 예상 질문 리스트 만들기

**문서 버전:** v1.0  
**작성일:** 2026년 1월 30일  
**상태:** 초안  
**분류:** 도구 > 생성

---

## 1. 개요

### 1.1 도구 정보

| 항목 | 내용 |
|------|------|
| 도구명 | 예상 질문 리스트 만들기 |
| 분류 | 생성 (create) |
| 타겟 사용자 | 초보 선생님 |
| LLM 엔진 | Google Gemini |
| API Key | Google AI Studio에서 발급 |

### 1.2 컨셉

> **"수업을 하는데 학생들이 어려운 질문을 해서 곤란했었나요? 이제는 미리 준비해보세요."**

배워볼 개념에 대해서 학생들이 물어볼만한 예상 질문 리스트를 뽑아보고, 거기에 줄 수 있는 답변과 예시까지. 걱정하지 말고 수업 준비하세요.

### 1.3 사용 방법 (툴팁 문구)

```
왼쪽에 정보를 입력하면, 오른쪽에서 내용을 미리보기 할 수 있어요. 
자료를 다운로드도 받으세요.
```

---

## 2. 화면 설계

### 2.1 전체 레이아웃

```
┌──────────────────────────────────────────────────────────────────┐
│  헤더: 예상 질문 리스트 만들기                         [?] 도움말  │
├─────────────────────────┬────────────────────────────────────────┤
│                         │                                        │
│      입력 패널          │           결과 패널                     │
│      (왼쪽)             │           (오른쪽)                      │
│                         │                                        │
│   - 학급 선택           │   생성 전: 디폴트 페이지                │
│   - 과목 선택           │   생성 후: 결과 미리보기                │
│   - 개념 입력 (필수)    │                                        │
│   - 학생 특징           │                                        │
│   - 설명 형식           │                                        │
│                         │                                        │
│   [생성하기] 버튼       │              [다운로드] 버튼            │
│                         │                                        │
└─────────────────────────┴────────────────────────────────────────┘
```

### 2.2 왼쪽 패널 - 입력 영역

#### 2.2.1 입력 필드 상세

| 필드명 | 타입 | 필수 | 옵션값 | 플레이스홀더/설명 |
|--------|------|------|--------|-------------------|
| 학급 | Dropdown | ❌ | 중등1, 중등2, 중등3, 고등1, 고등2, 고등3 | "학급을 선택하세요" |
| 과목 | Dropdown | ❌ | 영어, 수학, 과학 | "과목을 선택하세요" |
| 개념 | TextInput | ✅ | - | "수업 진도 나갈 내용의 개념을 적어주세요 (예: 소인수분해)" |
| 학생 특징 | TextArea | ❌ | - | "학생들의 특징을 적어주세요 (예: 오늘 소인수분해 공부를 2번째 하였음)" |
| 설명 형식 | Checkbox Group | ❌ | 텍스트, 이미지, 유튜브 연관 영상 링크, 4지선다 문항 | 복수 선택 가능 |

#### 2.2.2 입력 필드 데이터 구조

```typescript
interface InputFormData {
  grade?: '중등1' | '중등2' | '중등3' | '고등1' | '고등2' | '고등3';
  subject?: '영어' | '수학' | '과학';
  concept: string;  // 필수
  studentCharacteristics?: string;
  explanationType?: {
    text: boolean;
    image: boolean;
    youtubeLink: boolean;
    multipleChoice: boolean;
  };
}
```

#### 2.2.3 생성 전 상태

```
┌─────────────────────────┐
│ 📚 수업 정보 입력        │
├─────────────────────────┤
│                         │
│ 학급 (선택)             │
│ ┌─────────────────────┐ │
│ │ 학급을 선택하세요  ▼ │ │
│ └─────────────────────┘ │
│                         │
│ 과목 (선택)             │
│ ┌─────────────────────┐ │
│ │ 과목을 선택하세요  ▼ │ │
│ └─────────────────────┘ │
│                         │
│ 개념 (필수) *           │
│ ┌─────────────────────┐ │
│ │ 예: 소인수분해       │ │
│ └─────────────────────┘ │
│                         │
│ 학생 특징 (선택)        │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ 설명 형식 (선택)        │
│ ☐ 텍스트               │
│ ☐ 이미지               │
│ ☐ 유튜브 연관 영상 링크 │
│ ☐ 4지선다 문항         │
│                         │
│ ┌─────────────────────┐ │
│ │     🚀 생성하기      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### 2.2.4 생성 후 상태 (프롬프트 수정 모드)

```
┌─────────────────────────┐
│ ✏️ 결과 수정하기         │
├─────────────────────────┤
│                         │
│ 추가 요청사항           │
│ ┌─────────────────────┐ │
│ │ 예: 질문을 더 쉽게   │ │
│ │ 만들어주세요         │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     🔄 다시 생성     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     🆕 새로 만들기   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

### 2.3 오른쪽 패널 - 결과 영역

#### 2.3.1 생성 전 (디폴트 페이지)

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│           ┌──────────────┐             │
│           │   📝 아이콘   │             │
│           └──────────────┘             │
│                                        │
│      왼쪽에서 정보를 입력하고          │
│      [생성하기] 버튼을 눌러주세요       │
│                                        │
│      예상 질문 리스트가                │
│      이곳에 표시됩니다.                │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

#### 2.3.2 생성 중 (로딩 상태)

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│           ┌──────────────┐             │
│           │   ⏳ 로딩     │             │
│           └──────────────┘             │
│                                        │
│        예상 질문을 생성하고 있어요...   │
│                                        │
│         ████████░░░░░░░░ 60%           │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

#### 2.3.3 생성 후 (결과 표시)

결과물은 4개 섹션으로 구분하여 가독성을 높입니다.

```
┌────────────────────────────────────────┐
│                    ┌──────────────────┐│
│                    │ 📥 Word 다운로드 ││
│                    └──────────────────┘│
├────────────────────────────────────────┤
│ 📋 섹션 1: 입력 정보 요약               │
├────────────────────────────────────────┤
│                                        │
│  학급: 중등2  |  과목: 수학             │
│  개념: 소인수분해                       │
│  학생 특징: 오늘 소인수분해 공부를      │
│            2번째 하였음                │
│                                        │
├────────────────────────────────────────┤
│ 📖 섹션 2: 개념 상세 설명               │
├────────────────────────────────────────┤
│                                        │
│  [소인수분해란?]                        │
│                                        │
│  소인수분해는 합성수를 소수들의 곱으로  │
│  나타내는 것입니다. 예를 들어...        │
│                                        │
│  • 핵심 포인트 1                        │
│  • 핵심 포인트 2                        │
│  • 핵심 포인트 3                        │
│                                        │
├────────────────────────────────────────┤
│ ❓ 섹션 3: 예상 질문 리스트 (5개)       │
├────────────────────────────────────────┤
│                                        │
│  Q1. 소인수분해는 왜 배워야 하나요?     │
│  Q2. 소수와 합성수의 차이는 무엇인가요? │
│  Q3. 1은 왜 소수가 아닌가요?            │
│  Q4. 소인수분해를 빨리 하는 방법은?     │
│  Q5. 실생활에서 소인수분해는 어디에     │
│      사용되나요?                        │
│                                        │
├────────────────────────────────────────┤
│ 💡 섹션 4: 질문별 답변 및 부연 설명     │
├────────────────────────────────────────┤
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Q1. 소인수분해는 왜 배워야     │    │
│  │     하나요?                    │    │
│  ├────────────────────────────────┤    │
│  │ ✅ 답변                         │    │
│  │ 소인수분해는 수학의 기초가     │    │
│  │ 되는 개념으로...               │    │
│  ├────────────────────────────────┤    │
│  │ 📝 부연 설명                    │    │
│  │ 학생들에게 설명할 때는...      │    │
│  │                                │    │
│  │ [이미지] (선택 시)             │    │
│  │ [유튜브 링크] (선택 시)        │    │
│  │ [4지선다 문항] (선택 시)       │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Q2. 소수와 합성수의 차이는...  │    │
│  │ ...                            │    │
│  └────────────────────────────────┘    │
│                                        │
│  (Q3 ~ Q5 동일 구조)                   │
│                                        │
└────────────────────────────────────────┘
```

---

## 3. 데이터 구조

### 3.1 API 요청 (Request)

```typescript
interface GenerateQuestionsRequest {
  grade?: string;
  subject?: string;
  concept: string;
  studentCharacteristics?: string;
  explanationType?: {
    text: boolean;
    image: boolean;
    youtubeLink: boolean;
    multipleChoice: boolean;
  };
}
```

### 3.2 API 응답 (Response)

```typescript
interface GenerateQuestionsResponse {
  id: string;
  createdAt: string;
  
  // 섹션 1: 입력 정보
  inputSummary: {
    grade?: string;
    subject?: string;
    concept: string;
    studentCharacteristics?: string;
  };
  
  // 섹션 2: 개념 설명
  conceptExplanation: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  
  // 섹션 3: 예상 질문 리스트
  questions: string[];  // 5개
  
  // 섹션 4: 질문별 답변
  answers: QuestionAnswer[];
}

interface QuestionAnswer {
  questionNumber: number;
  question: string;
  answer: string;
  additionalExplanation: string;
  
  // 선택 항목 (사용자가 체크한 경우에만)
  imageUrl?: string;
  youtubeLink?: string;
  multipleChoice?: {
    question: string;
    options: string[];  // 4개
    correctAnswer: number;  // 0-3
    explanation: string;
  };
}
```

### 3.3 저장 데이터 구조 (만든 자료)

```typescript
interface SavedOutput {
  outputId: string;
  toolId: 'expected-questions-generator';
  toolName: '예상 질문 리스트 만들기';
  title: string;  // "{개념} 예상 질문 리스트"
  type: 'download';
  format: 'docx';
  fileUrl: string;
  createdAt: string;
  
  // 메타데이터
  metadata: {
    grade?: string;
    subject?: string;
    concept: string;
    questionCount: number;
  };
}
```

---

## 4. LLM 프롬프트 설계

### 4.1 시스템 프롬프트

```
당신은 경험 많은 교육 전문가입니다. 
초보 선생님들이 수업을 준비할 때 학생들의 예상 질문에 대비할 수 있도록 도와주세요.

다음 규칙을 따라주세요:
1. 학생의 수준과 특성을 고려하여 실제로 물어볼 법한 질문을 생성하세요.
2. 답변은 학생 눈높이에 맞춰 쉽고 명확하게 작성하세요.
3. 부연 설명은 선생님이 수업에서 바로 활용할 수 있도록 구체적으로 작성하세요.
4. 한국 교육과정에 맞는 내용으로 작성하세요.
```

### 4.2 사용자 프롬프트 템플릿

```
## 수업 정보
- 학급: {grade || '미지정'}
- 과목: {subject || '미지정'}
- 개념: {concept}
- 학생 특징: {studentCharacteristics || '특별한 특징 없음'}

## 요청 사항
위 개념에 대해 다음 내용을 생성해주세요:

1. **개념 상세 설명**
   - 개념의 정의와 핵심 포인트 3가지

2. **예상 질문 5개**
   - 학생들이 실제로 물어볼 법한 질문
   - 쉬운 질문부터 어려운 질문 순으로 정렬

3. **각 질문에 대한 답변**
   - 명확한 답변
   - 선생님이 참고할 부연 설명
   {explanationTypePrompt}

## 출력 형식
JSON 형식으로 출력해주세요.
```

### 4.3 설명 형식별 추가 프롬프트

```typescript
const explanationTypePrompts = {
  text: '',  // 기본값
  image: '- 답변과 관련된 이미지 설명 또는 다이어그램 제안',
  youtubeLink: '- 관련 유튜브 영상 검색 키워드 제안',
  multipleChoice: '- 해당 개념을 확인할 수 있는 4지선다 문항 1개'
};
```

---

## 5. Word 다운로드 기능

### 5.1 문서 구조

```
┌─────────────────────────────────────┐
│         예상 질문 리스트             │
│       {개념} - {과목} {학급}         │
│                                     │
│ 생성일: 2026-01-30                  │
├─────────────────────────────────────┤
│                                     │
│ [1. 수업 정보]                      │
│ • 학급: 중등2                       │
│ • 과목: 수학                        │
│ • 개념: 소인수분해                  │
│ • 학생 특징: ...                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ [2. 개념 설명]                      │
│ ...                                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ [3. 예상 질문 리스트]               │
│ Q1. ...                             │
│ Q2. ...                             │
│ Q3. ...                             │
│ Q4. ...                             │
│ Q5. ...                             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ [4. 질문별 답변]                    │
│                                     │
│ Q1. ...                             │
│ ─────────────────────               │
│ [답변]                              │
│ ...                                 │
│ [부연 설명]                         │
│ ...                                 │
│                                     │
│ (반복)                              │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 파일명 규칙

```
예상질문_{개념}_{날짜}.docx

예시: 예상질문_소인수분해_20260130.docx
```

---

## 6. 컴포넌트 구조

### 6.1 파일 구조

```
src/
├── pages/
│   └── tools/
│       └── ExpectedQuestionsGenerator/
│           ├── index.tsx                 # 메인 페이지
│           ├── ExpectedQuestionsGenerator.tsx
│           └── components/
│               ├── InputPanel.tsx        # 왼쪽 입력 패널
│               ├── InputForm.tsx         # 입력 폼
│               ├── ModifyForm.tsx        # 수정 폼 (생성 후)
│               ├── ResultPanel.tsx       # 오른쪽 결과 패널
│               ├── DefaultView.tsx       # 생성 전 디폴트
│               ├── LoadingView.tsx       # 로딩 상태
│               ├── ResultView.tsx        # 결과 표시
│               ├── InputSummarySection.tsx
│               ├── ConceptSection.tsx
│               ├── QuestionsSection.tsx
│               └── AnswersSection.tsx
│
├── services/
│   └── tools/
│       └── expectedQuestionsService.ts   # API 서비스
│
├── hooks/
│   └── tools/
│       └── useExpectedQuestions.ts       # 커스텀 훅
│
└── utils/
    └── tools/
        └── expectedQuestionsDocx.ts      # Word 생성 유틸
```

### 6.2 상태 관리

```typescript
interface ExpectedQuestionsState {
  // 입력 상태
  formData: InputFormData;
  
  // 생성 상태
  status: 'idle' | 'loading' | 'success' | 'error';
  
  // 결과 데이터
  result: GenerateQuestionsResponse | null;
  
  // 에러
  error: string | null;
  
  // 수정 모드
  isModifyMode: boolean;
  modifyPrompt: string;
}
```

---

## 7. API 명세

### 7.1 질문 생성 API

```
POST /api/tools/expected-questions/generate
```

**Request Body:**
```json
{
  "grade": "중등2",
  "subject": "수학",
  "concept": "소인수분해",
  "studentCharacteristics": "오늘 소인수분해 공부를 2번째 하였음",
  "explanationType": {
    "text": true,
    "image": false,
    "youtubeLink": true,
    "multipleChoice": false
  }
}
```

**Response:**
```json
{
  "id": "eq_001",
  "createdAt": "2026-01-30T10:30:00Z",
  "inputSummary": { ... },
  "conceptExplanation": { ... },
  "questions": [ ... ],
  "answers": [ ... ]
}
```

### 7.2 결과 수정 API

```
POST /api/tools/expected-questions/modify
```

**Request Body:**
```json
{
  "originalId": "eq_001",
  "modifyPrompt": "질문을 더 쉽게 만들어주세요"
}
```

### 7.3 Word 다운로드 API

```
GET /api/tools/expected-questions/{id}/download
```

**Response:** `.docx` 파일 스트림

---

## 8. Google Gemini 연동

### 8.1 설정

```typescript
// config/gemini.ts
export const geminiConfig = {
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  }
};
```

### 8.2 API 호출 예시

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
const model = genAI.getGenerativeModel({ model: geminiConfig.model });

async function generateQuestions(input: GenerateQuestionsRequest) {
  const prompt = buildPrompt(input);
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return parseResponse(text);
}
```

---

## 9. UI/UX 가이드

### 9.1 컬러 사용

```css
/* 도구 카테고리 색상 - 생성 */
--tool-category-create: #2196F3;

/* 섹션별 배경색 */
--section-input-bg: #E3F2FD;    /* 입력 정보 섹션 */
--section-concept-bg: #FFF8E1;   /* 개념 설명 섹션 */
--section-question-bg: #E8F5E9;  /* 질문 리스트 섹션 */
--section-answer-bg: #FFFFFF;    /* 답변 섹션 */
```

### 9.2 반응형 대응

```css
/* 모바일 (768px 이하) */
@media (max-width: 768px) {
  .tool-container {
    flex-direction: column;
  }
  
  .input-panel,
  .result-panel {
    width: 100%;
  }
}
```

### 9.3 툴팁 위치

- 헤더 우측 `[?]` 아이콘 클릭 시 사용 방법 표시
- 필수 입력 필드 옆 `*` 표시
- 각 입력 필드에 hover 시 안내 툴팁

---

## 10. 에러 처리

### 10.1 에러 케이스

| 에러 코드 | 상황 | 사용자 메시지 |
|-----------|------|---------------|
| CONCEPT_REQUIRED | 개념 미입력 | "개념을 입력해주세요." |
| GEMINI_ERROR | API 호출 실패 | "잠시 후 다시 시도해주세요." |
| GEMINI_TIMEOUT | 응답 시간 초과 | "생성 시간이 오래 걸리고 있어요. 다시 시도해주세요." |
| PARSE_ERROR | 응답 파싱 실패 | "결과 생성 중 문제가 발생했어요." |

### 10.2 재시도 로직

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

async function generateWithRetry(input: GenerateQuestionsRequest) {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await generateQuestions(input);
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      await delay(RETRY_DELAY * (i + 1));
    }
  }
}
```

---

## 11. 테스트 시나리오

### 11.1 기본 플로우

1. ✅ 필수값(개념)만 입력하고 생성
2. ✅ 모든 필드 입력하고 생성
3. ✅ 생성 후 수정 요청
4. ✅ Word 다운로드
5. ✅ 새로 만들기

### 11.2 엣지 케이스

1. ⚠️ 개념 미입력 시 에러 메시지
2. ⚠️ 네트워크 에러 시 재시도
3. ⚠️ 긴 개념명 입력 (100자 이상)
4. ⚠️ 특수문자 포함 입력

---

## 12. 향후 개선 사항

- [ ] 질문 개수 사용자 지정 (5개 → 3~10개)
- [ ] 난이도 선택 옵션
- [ ] 이전 생성 기록 불러오기
- [ ] 즐겨찾기 기능
- [ ] PDF 다운로드 추가
- [ ] 학습 자료 연계 (교과서, 문제집 링크)

---

**문서 끝**
