# Irisa Analyzer Backend 배포 (Render)

## 1) Render 프로젝트 생성
1. Render 로그인 → New → **Web Service**
2. Repository: `rhiels00-byte/shell`
3. Root Directory: `tools/irisa-analyzer`
4. Build Command: `npm install`
5. Start Command: `npm run start:api`

## 2) 환경 변수 설정
Render → Environment 탭에서 추가:

- `OPENAI_API_KEY` = 실제 키
- `OPENAI_MODEL` = `gpt-4.1-mini`
- `PORT` = `5174` (선택)

## 3) 배포 후 확인
Render가 만든 URL을 확인:
- 예: `https://irisa-analyzer-api.onrender.com`

아래 엔드포인트로 응답 확인:
- `POST /api/analyze`
- `POST /api/mappings`

## 4) 프론트 연결
Vercel 환경 변수에 추가:

```
VITE_IRISA_API_BASE=https://<render-서비스-주소>
VITE_SHOW_INTERNAL_COST=true
```

## 5) 주의사항
- Render Free 플랜은 슬립이 있음 (첫 호출 지연 가능)
- 비용 표시는 내부용 토글이며, 출시 시 `VITE_SHOW_INTERNAL_COST=false`
