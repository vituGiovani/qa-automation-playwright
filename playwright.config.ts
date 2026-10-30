import { defineConfig, devices } from '@playwright/test';

const UI_URL = process.env.UI_URL ?? 'https://www.saucedemo.com';
const API_URL = process.env.API_URL ?? 'https://dummyjson.com';

/**
 * Configuração central da suíte.
 * - Projetos de UI (E2E + acessibilidade) rodam em 3 navegadores.
 * - Projeto "api" roda os testes de API e de validação de dados com SQL (sem navegador).
 */
export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests',
      testMatch: /(e2e|a11y)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: UI_URL },
    },
    {
      name: 'firefox',
      testDir: './tests',
      testMatch: /(e2e|a11y)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], baseURL: UI_URL },
    },
    {
      name: 'webkit',
      testDir: './tests',
      testMatch: /(e2e|a11y)\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'], baseURL: UI_URL },
    },
    {
      name: 'api',
      testDir: './tests',
      testMatch: /(api|sql)\/.*\.spec\.ts/,
      use: { baseURL: API_URL, extraHTTPHeaders: { Accept: 'application/json' } },
    },
  ],
});
