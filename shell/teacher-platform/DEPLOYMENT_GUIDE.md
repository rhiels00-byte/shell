# 배포 가이드 (Deployment Guide)

## 현재 배포 상태

### ✅ GitHub
- **저장소**: https://github.com/rhiels00-byte/shell
- **브랜치**: main
- **상태**: 배포 완료

### 🔄 Vercel
- **프로젝트**: https://vercel.com/rhiels00-bytes-projects/shell
- **자동 배포**: GitHub 연동 필요

---

## Vercel 배포 방법

### 방법 1: GitHub 자동 배포 (권장)

1. **Vercel 대시보드 접속**
   ```
   https://vercel.com/rhiels00-bytes-projects
   ```

2. **Import Project 클릭**
   - "Add New..." → "Project" 클릭
   - 또는 직접 접속: https://vercel.com/new

3. **GitHub 저장소 선택**
   - "Import Git Repository" 섹션에서
   - `rhiels00-byte/shell` 저장소 선택
   - "Import" 버튼 클릭

4. **프로젝트 설정 확인**
   ```
   Framework Preset: Vite (자동 감지됨)
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
   - 설정은 `vercel.json`에 이미 정의되어 있으므로 그대로 진행

5. **Deploy 버튼 클릭**
   - 첫 배포가 자동으로 시작됩니다
   - 약 1-2분 소요

6. **배포 완료**
   - 배포 URL 확인: `https://shell-xxxxx.vercel.app`
   - 또는 커스텀 도메인 설정 가능

### 방법 2: Vercel CLI 배포 (선택사항)

CLI를 통해 수동으로 배포하려면:

```bash
# 1. Vercel 로그인 (브라우저 인증 필요)
npx vercel login

# 2. 프로젝트 링크
npx vercel link

# 3. 배포
npx vercel --prod
```

---

## 자동 배포 설정 (CI/CD)

GitHub 저장소가 Vercel에 연결되면:

### 자동 배포 트리거
- ✅ `main` 브랜치에 푸시 → **프로덕션 배포**
- ✅ Pull Request 생성 → **프리뷰 배포**
- ✅ 커밋 푸시 → **자동 재배포**

### 환경 변수 설정 (필요시)
Vercel 대시보드에서:
1. Project Settings → Environment Variables
2. 필요한 환경 변수 추가 (예: API 키)

---

## 배포 확인 체크리스트

### GitHub 배포 확인
- [x] 코드가 GitHub에 푸시됨
- [x] README.md 문서 업데이트됨
- [x] vercel.json 설정 파일 포함됨

### Vercel 배포 확인
- [ ] GitHub 저장소 연결 완료
- [ ] 첫 배포 성공
- [ ] 배포 URL 접속 테스트
- [ ] 라우팅 정상 작동 확인 (/tools, /settings 등)

---

## 배포 후 테스트 항목

배포가 완료되면 다음 항목을 테스트하세요:

1. **홈 페이지** (`/`)
   - 프롬프트 입력창 표시
   - 도구 타일 그리드 표시

2. **도구 페이지** (`/tools`)
   - 검색 기능 작동
   - 카테고리 필터링 작동

3. **채팅 내역** (`/chat-history`)
   - 채팅 목록 표시
   - 채팅 상세 내용 표시

4. **만든 자료** (`/materials`)
   - 자료 카드 표시
   - 필터링 작동

5. **설정** (`/settings`)
   - 탭 전환 작동
   - 폼 입력 정상

6. **라우팅**
   - 브라우저 새로고침 시 404 발생하지 않음
   - 뒤로가기/앞으로가기 정상 작동

---

## 문제 해결

### 빌드 실패 시
```bash
# 로컬에서 빌드 테스트
npm run build

# 빌드 결과 확인
npm run preview
```

### 라우팅 문제 시
- `vercel.json`의 rewrites 설정 확인
- SPA 라우팅을 위해 모든 경로가 `/index.html`로 리다이렉트되어야 함

### 스타일 미적용 시
- Tailwind CSS 빌드 확인
- `postcss.config.js` 설정 확인
- `@tailwindcss/postcss` 패키지 설치 확인

---

## 유용한 링크

- **GitHub 저장소**: https://github.com/rhiels00-byte/shell
- **Vercel 프로젝트**: https://vercel.com/rhiels00-bytes-projects/shell
- **Vercel 문서**: https://vercel.com/docs
- **Vite 배포 가이드**: https://vitejs.dev/guide/static-deploy.html

---

## 다음 단계

배포 후:
1. ✅ 커스텀 도메인 연결 (선택사항)
2. ✅ 환경 변수 설정 (Phase 2에서 필요)
3. ✅ 성능 모니터링 설정
4. ✅ Analytics 설정 (Vercel Analytics)
