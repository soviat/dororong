# ALL-IN-ONE (APPLIED) — project-eae45

## 무엇이 다른가
- `web/auth.js`에 **네 프로젝트 설정(firebaseConfig)**를 이미 적용해 두었음.
- `web/selfcheck.html`에서 로그인/가입 버튼으로 즉시 동작 확인 가능.

## 배포(간단)
```bash
npm i -g firebase-tools
firebase login
firebase use project-eae45
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage:rules
(cd functions && npm i)
firebase deploy --only functions
firebase deploy --only hosting
```

## 확인
- 배포 후 Hosting URL 뒤에 `/selfcheck.html`을 열어 로그인/가입 테스트
- Google/Email 로그인은 콘솔에서 제공업체 활성화 필수