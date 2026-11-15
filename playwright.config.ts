import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests run against the real static export (./out), served like GitHub Pages.
 * Run `npm run build` first. Locally this uses the Microsoft Edge that ships with Windows
 * (no browser download); in CI it uses Playwright's Chromium (`npx playwright install chromium`).
 */
const channel = process.env.CI ? undefined : (process.env.PW_CHANNEL ?? "msedge");

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel, viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: {
    command: "node scripts/serve-out.mjs 4173",
    url: "http://localhost:4173/en/",
    reuseExistingServer: !process.env.CI,
  },
});
