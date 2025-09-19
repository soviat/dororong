# 운영 가이드 (EXTREME)
## 1) 푸시 알림
- 프런트에서 FCM 토큰을 받아 `registerDeviceToken` callable로 저장하세요.
- 키워드 알림(`notifications`) 또는 채팅 메시지 생성 시 FCM 발송.

## 2) Algolia 인덱싱(선택)
```bash
firebase functions:config:set algolia.app_id="APPID" algolia.admin_key="ADMINKEY" algolia.index="listings"
# 또는 배포 시 환경변수:
# ALGOLIA_APP_ID=... ALGOLIA_ADMIN_KEY=... ALGOLIA_INDEX=listings firebase deploy --only functions
```
- 인덱싱 트리거: `listings` onWrite

## 3) PWA
- `/web/manifest.webmanifest`, `/web/sw.js` 포함
- `<head>`에 `seo.html` include 또는 내용 복사

## 4) 시드 데이터
```bash
# Emulator
export FIRESTORE_EMULATOR_HOST=localhost:8080
node tools/seed.mjs
```

## 5) 보안/규정
- 관리자 권한: Custom Claims
- 밴(banned) 사용자: rules에서 생성 차단