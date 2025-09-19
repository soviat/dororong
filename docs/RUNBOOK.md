# RUNBOOK — 도로롱 MEGA OPS
## 장애 대응
1) `/health` 호출로 파이어스토어 쓰기 확인
2) Functions 로그에서 `resource-exhausted` 빈발 시 rate limit 상향 또는 클라이언트 재시도 백오프 적용
3) 월간 리포트 미생성 시 `functions.scheduler` 상태 확인, 수동 실행