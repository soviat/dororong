# ARCHITECTURE
- 프런트: 정적 ES Modules (Firebase SDK)
- 백엔드: Functions (Node 20), Firestore/Storage/FCM
- 보안: Firestore/Storage rules + 서버검증
- 배치: Scheduler (월간 보고서)
- 운영: CI/CD(GitHub Actions), 연기 채널 배포