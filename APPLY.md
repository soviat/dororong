# 도로롱 ALL-IN-ONE — 적용 방법 (원샷)

## 1) Firebase 기본 설정
```bash
npm i -g firebase-tools
firebase login
firebase use <YOUR_PROJECT_ID>
```

- 콘솔에서 Authentication: Email/Password + Google + Apple 활성화
- 허용 도메인에 localhost/배포 도메인 추가
- Firestore/Storage/Hosting 활성화

## 2) 환경 바꿔치기
- `/web/auth.js` 안의 `firebaseConfig`를 네 프로젝트 값으로 교체
- (푸시) VAPID 키를 `messaging.auto.js` 또는 사용하는 초기화 스크립트에 지정
- (선택) Stripe:
```bash
firebase functions:config:set stripe.secret="sk_test_..." stripe.signing_secret="whsec_..."
```
- (선택) Algolia:
```bash
firebase functions:config:set algolia.app_id="APPID" algolia.admin_key="ADMINKEY" algolia.index="listings"
```

## 3) Rules/Indexes/Functions/Hosting 배포
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage:rules
(cd functions && npm i)
firebase deploy --only functions
firebase deploy --only hosting
```

## 4) 스모크 테스트 (체크 리스트)
- 로그인/회원가입/로그아웃
- 상품 등록 → 썸네일 생성 확인(목록/상세 srcset)
- 채팅 송수신 & 푸시 수신
- 결제 플로우(모의 또는 Stripe) → 주문 전이
- 주문 상세 페이지에서 상태 버튼 전이
- 신고/관리자 모더레이션/분쟁 관리 화면 동작
- 리포트 CSV/PDF, 정산서 PDF 생성/다운로드
- PWA 설치, 오프라인 폴백 확인
- Lighthouse CI 점수 0.9+ 유지

## 5) 문제 시 빠른 복구
- Hosting: Release History에서 Rollback
- Functions: 이전 커밋으로 되돌려 재배포
- Rules: 임시 완화 후 원인 파악 → 재강화

---
머지 순서(최신 우선): dororong_ultimate.zip, dororong_extreme.zip, dororong_pay_admin_pack.zip, dororong_safe_ops_pack.zip, dororong_finance_disputes_pack.zip, dororong_ops_plus_pack.zip, dororong_mega_ops_pack.zip, dororong_final_polish_pack.zip
생성 시각: 2025-09-13 12:53:21