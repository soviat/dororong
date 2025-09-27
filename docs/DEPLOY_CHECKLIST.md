# DEPLOY CHECKLIST (FINAL POLISH)
- [ ] Firebase Functions 배포: `vitals`, `err`
- [ ] 프런트에 `sentry.init.js` / `webvitals.js` 로드 (전역)
- [ ] LHCI 워크플로우 활성화 → PR/Merge 시 점수 0.9 미만이면 알림
- [ ] 퍼포먼스 버짓(스크립트 ≤ 350KB, total ≤ 900KB) 유지
- [ ] 에러/바이탈 컬렉션 모니터링 대시보드 생성 (`_errors`, `_vitals`)