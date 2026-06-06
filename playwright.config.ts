import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/steps',
  testMatch: '**/*.spec.ts',
  retries: 1,
  workers: 2,
  timeout: 30_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],
  use: {
    extraHTTPHeaders: { Accept: 'application/json' },
  },
});
