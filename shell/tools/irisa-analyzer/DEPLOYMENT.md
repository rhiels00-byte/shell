# Vercel 배포 가이드

## 방법 1: Vercel 웹사이트에서 배포 (권장)

### 1단계: Vercel 계정 생성
- [https://vercel.com](https://vercel.com) 접속
- "Sign Up" 클릭
- GitHub 계정으로 로그인

### 2단계: 새 프로젝트 임포트
1. Vercel 대시보드에서 "Add New..." 버튼 클릭
2. "Project" 선택
3. GitHub 리포지토리 목록에서 `irisa-analyzer` 찾기
4. "Import" 버튼 클릭

### 3단계: 프로젝트 설정
1. **Framework Preset**: Next.js (자동 감지됨)
2. **Build Command**: `npm run build` (기본값)
3. **Output Directory**: `.next` (기본값)
4. **Install Command**: `npm install` (기본값)

### 4단계: 환경 변수 설정 ⚠️ 중요!
배포하기 전에 반드시 환경 변수를 설정하세요:

1. "Environment Variables" 섹션 펼치기
2. 다음 환경 변수 추가:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: (여기에 실제 OpenAI API 키 입력)
   - **Environment**: Production, Preview, Development 모두 선택

### 5단계: 배포
1. "Deploy" 버튼 클릭
2. 빌드 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 URL 확인

배포된 URL은 다음과 같은 형식입니다:
```
https://irisa-analyzer-xxxxx.vercel.app
```

---

## 방법 2: Vercel CLI로 배포

### 1단계: Vercel 로그인
```bash
cd /Users/lisa/Desktop/프로젝트/shell/tools/irisa-analyzer
npx vercel login
```

이메일 인증을 완료하세요.

### 2단계: 환경 변수 설정
```bash
npx vercel env add OPENAI_API_KEY
```

프롬프트에서:
- 환경 변수 값 입력 (OpenAI API 키)
- 적용할 환경 선택: Production, Preview, Development

### 3단계: 배포
```bash
npx vercel --prod
```

---

## OpenAI API 키 발급받기

아직 OpenAI API 키가 없다면:

1. [https://platform.openai.com](https://platform.openai.com) 접속
2. 로그인 또는 계정 생성
3. 우측 상단 프로필 → "API keys" 클릭
4. "Create new secret key" 클릭
5. 키 이름 입력 후 생성
6. **⚠️ 중요**: 생성된 키를 안전한 곳에 복사 (다시 볼 수 없음)

---

## 배포 후 확인사항

### 1. 웹사이트 접속 테스트
배포된 URL로 접속하여 페이지가 정상적으로 로드되는지 확인

### 2. 기능 테스트
- 학급 정보 입력 폼이 정상 작동하는지
- 파일 업로드가 가능한지
- "분석 생성" 버튼이 작동하는지
- 분석 결과가 정상적으로 표시되는지
- Word/PDF 다운로드가 가능한지

### 3. API 연동 확인
- 실제 이미지 파일로 분석 테스트
- OpenAI API 호출이 정상적으로 이루어지는지
- 에러가 발생하면 Vercel 대시보드의 "Functions" → "Logs"에서 확인

---

## 트러블슈팅

### 빌드 실패 시
1. Vercel 대시보드에서 "Deployments" 탭 확인
2. 실패한 빌드 클릭 → 로그 확인
3. 환경 변수가 제대로 설정되었는지 확인

### API 호출 에러 시
1. 환경 변수 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
2. OpenAI API 키가 유효하고 크레딧이 있는지 확인
3. Vercel Functions 로그에서 에러 메시지 확인

### 파일 업로드 실패 시
- Vercel Serverless Functions는 기본적으로 요청 본문 크기 제한이 있음 (4.5MB)
- 큰 비디오 파일은 업로드 제한에 걸릴 수 있음
- 필요시 `vercel.json` 설정 추가:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

---

## 업데이트 배포

코드를 수정한 후 재배포:

```bash
git add .
git commit -m "feat: update features"
git push origin main
```

Vercel이 자동으로 감지하여 새로 배포합니다 (CI/CD).

---

## 프로젝트 정보

- **GitHub**: https://github.com/rhiels00-byte/irisa-analyzer
- **Tech Stack**: Next.js 15, React 19, TypeScript, OpenAI GPT-4o
- **Deployment**: Vercel (Serverless Functions)
