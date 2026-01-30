# 도구 템플릿

이 템플릿을 복사하여 새로운 도구를 만들 수 있습니다.

## 사용 방법

### 1. 템플릿 복사
```bash
cp -r tools/_template tools/tool-{새도구이름}
cd tools/tool-{새도구이름}
```

### 2. package.json 수정
```json
{
  "name": "tool-{새도구이름}",
  "description": "도구 설명을 여기에",
  "author": "당신의 이름",
  "main": "src/{컴포넌트이름}.tsx"
}
```

### 3. 컴포넌트 파일 이름 변경
```bash
mv src/ToolTemplate.tsx src/{컴포넌트이름}.tsx
```

### 4. 컴포넌트 내용 수정
- 컴포넌트 이름 변경
- toolId, toolName 수정
- formData 구조 정의
- 입력 폼 구현
- 출력 형식 구현

### 5. PRD 작성
`PRD.md` 파일을 만들어 도구 요구사항 작성

### 6. 플랫폼 관리자에게 등록 요청
다음 정보를 전달:
- id: 도구 고유 ID (kebab-case)
- name: 도구 이름 (한글)
- description: 도구 설명
- icon: 이모지 아이콘
- category: 'create' 또는 'analyze'
- route: `/tool/{도구id}`

### 7. 개발 및 테스트
```bash
cd ../../teacher-platform
npm run dev
```

브라우저에서 `http://localhost:5173/tool/{도구id}` 접속

## 체크리스트

- [ ] 템플릿 복사 완료
- [ ] package.json 수정 완료
- [ ] 컴포넌트 파일 이름 변경 완료
- [ ] 컴포넌트 내용 수정 완료
- [ ] PRD.md 작성 완료
- [ ] 플랫폼 관리자에게 등록 요청 완료
- [ ] 로컬 테스트 완료
- [ ] Git commit 및 push 완료
