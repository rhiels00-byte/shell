# 배포 가이드 (Deployment + CI/CD Rules)

## 목적

- `shell` 모노레포에서 **teacher-platform만 안정적으로 배포**하기 위한 규칙과 절차를 정의합니다.
- 팀원 A/B/C(도구)와 팀원 D(새 서비스) 작업이 **배포 파이프라인에 영향**을 주지 않도록 분리합니다.

---

## 0) 핵심 규칙 (요약)

1. **배포 대상은 `teacher-platform/` 하나**입니다. 다른 폴더 변경은 배포 실패 원인이 되어서는 안 됩니다.
2. **Vercel 프로젝트 Root Directory는 `teacher-platform`로 고정**합니다.
3. 프레임워크는 **Vite 고정**이며, 변경 시 반드시 문서/설정을 함께 업데이트합니다.
4. `main` 브랜치로 들어가는 코드는 **CI 빌드 통과가 필수**입니다.
5. 도구(teams A/B/C/D)는 **`tools/` 아래만 수정**하며, 플랫폼 관리자의 승인 없이 `teacher-platform/`에 직접 커밋하지 않습니다.

---

## 1) 저장소/서비스 구조

### GitHub
- 저장소: `https://github.com/rhiels00-byte/shell`
- 브랜치: `main` (배포 브랜치)

### Vercel (현재 운영)
- 프로젝트: `shell2`
- 배포 URL: `https://shell2-phi.vercel.app/`
- **Root Directory**: `teacher-platform`
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci` (또는 `npm install`)

---

## 2) 폴더 책임 구분 (협업 규칙)

### 플랫폼 관리자 (1명)
- 담당: `teacher-platform/`
- 책임: 라우팅/공용 컴포넌트/레이아웃/배포 설정/`tools-config.json`

### 도구 개발자 (A/B/C/D)
- 담당: `tools/tool-*/` 또는 `tools/irisa-analyzer/`
- 책임: 도구 내부 코드/문서/PRD
- **금지**: `teacher-platform/` 직접 수정

---

## 3) 배포 파이프라인 (CI/CD 규칙)

### CI (GitHub Actions)
- 트리거: `main` push, PR
- 작업: `teacher-platform/` 기준으로 **lint + build**
- 실패 시: `main` 병합 금지

### CD (Vercel 자동 배포)
- 트리거: `main` push
- 동작: Vercel이 `teacher-platform/`에서 **Vite 빌드** 수행

---

## 4) Vercel 연결/복구 절차 (자동 배포가 안 될 때)

1. Vercel 프로젝트 설정에서 **Root Directory = `teacher-platform`** 확인
2. Framework Preset이 **Vite**인지 확인
3. Build/Output/Install 설정이 아래와 같은지 확인
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`
4. 설정이 꼬였으면 **프로젝트 삭제 → 다시 Import**
   - Import 시 Root Directory를 `teacher-platform`로 지정

> 중요: 루트(`shell/`)에는 `vercel.json`을 두지 않습니다.
> Root Directory를 `teacher-platform`으로 고정하고, 설정은 Vercel 프로젝트에서 관리합니다.

### 프로젝트 고정 규칙 (재발 방지)
- 운영은 `shell2`만 사용합니다. (기존 `shell` 프로젝트는 사용하지 않음)
- Root Directory 값은 **항상 `teacher-platform`으로 유지**합니다.
- Framework/Build/Output 설정은 **Vite 기준으로만** 유지합니다.
- 다른 프로젝트로 Import할 때는 **반드시 Root Directory를 지정**합니다.

### 자주 발생하는 실패 원인
- Root Directory 오타 또는 공백/슬래시 포함
- Root Directory를 비우고 루트에서 빌드 시도
- Framework를 Next.js로 변경
- 루트에 `vercel.json`을 추가해 설정 충돌

---

## 5) 변경 규칙 (프레임워크/구조 변경 시)

다음 변경은 **사전 합의 + 문서 업데이트**가 필요합니다.

- Vite → Next.js 등 프레임워크 변경
- `teacher-platform/` 위치 변경
- 루트 디렉터리 변경
- `vercel.json` 위치 변경

변경 시 반드시 다음 문서 갱신:
- `teacher-platform/DEPLOYMENT_GUIDE.md`
- `teacher-platform/README.md`

---

## 6) 체크리스트

### 배포 전
- [ ] `teacher-platform/`에서 `npm run lint` 통과
- [ ] `teacher-platform/`에서 `npm run build` 통과
- [ ] `tools-config.json` 변경 시 라우팅 확인

### 배포 후
- [ ] 홈(`/`) 로딩
- [ ] 도구 목록(`/tools`) 로딩
- [ ] 도구 실행 라우트(`/tool/*`) 404 없음

---

## 7) 롤백 규칙

- `main`에서 마지막 정상 커밋으로 되돌리고 push
- Vercel은 자동으로 이전 커밋 기준 재배포

---

## 변경 이력

- 2026-02-01: 모노레포 Vite 기준 배포 규칙/CI 파이프라인 정리
- 2026-02-01: Vercel 운영 프로젝트를 `shell2`로 고정 및 재발 방지 규칙 추가
