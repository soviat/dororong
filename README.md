# OPS PLUS Pack
## 포함
- 결제사 어댑터 스캐폴드: `createTossCheckout`, `createIamportCheckout` (+ webhook)
- 분쟁 **증빙 업로드** 페이지: `evidence.html` (Storage: admin만 열람)
- **CSV 내보내기** & **정산서 PDF 생성** 버튼: `sales_report_plus.html`
  - `generateSettlementPDF` 콜러블 → `public/statements/{orderId}.pdf` 생성 + 공개 URL 반환
- **헬스 체크**: `/health` HTTP 함수

## 적용
1) `/functions/index.js` 병합/배포 (`pdfkit` 의존성 포함)
   ```bash
   cd functions
   npm i
   firebase deploy --only functions
   ```
2) `/web` 파일 추가 + 네비 연결
3) `RULES_ADDON_OPS_PLUS.txt`의 Storage 규칙을 기존 `storage.rules`에 병합 후 배포

## 메모
- Toss/아임포트 부분은 실제 SDK 호출/서명 검증만 붙이면 실서비스 전환 가능
- 증빙 파일은 관리자만 열람하도록 기본 차단 — 노출 이슈 예방