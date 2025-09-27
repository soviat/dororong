# PERF PLAYBOOK
- 이미지: 썸네일 + srcset/sizes (이미 반영), WebP 허용 고려
- JS: 페이지별 모듈 분리, 중복 SDK 제거, 동적 import
- 폰트: `font-display: swap`, 시스템 폰트 기본
- 캐시: SW 캐시 히트율 모니터링, long-lived 캐시 헤더(정적)