// tests/smoke.spec.js
import { test, expect } from '@playwright/test';
test('index loads', async ({ page }) => {
  await page.goto('http://localhost:4173/index.html');
  await expect(page).toHaveTitle(/도로롱/);
});