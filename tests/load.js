// tests/load.js - k6 example
import http from 'k6/http';
import { sleep } from 'k6';
export const options = { vus: 20, duration: '30s' };
export default function () {
  http.get('https://your-host/index.html');
  sleep(1);
}