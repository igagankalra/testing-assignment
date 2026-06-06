import { defineConfig } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Playwright Configuration
//
// This config is used when running: npm run test:playwright
// It sets up the test runner for our API tests.
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  // Where to find test files
  testDir: './src/steps',

  // Only pick up files ending in .spec.ts
  testMatch: '**/*.spec.ts',

  // How many times to retry a failed test (useful for flaky network tests)
  retries: 1,

  // Run tests in parallel (safe for API tests since each uses a unique ID)
  workers: 2,

  // Timeout for each individual test (ms)
  timeout: 30000,

  // Reporter: shows results in terminal + saves HTML report
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
  ],

  use: {
    // baseURL is set on the request context inside the spec (from API_BASE_URL),
    // so PetApiClient can use relative paths like '/pet'.

    // Extra HTTP headers sent with every request
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },

  // No browser projects needed — this is API-only testing
  projects: [
    {
      name: 'api-tests',
      // No browser is launched; APIRequestContext is browser-independent
    },
  ],
});
