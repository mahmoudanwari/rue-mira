import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests run against the real static export (./out), served like GitHub Pages.
 * Run `npm run build` first. Locally this uses the Microsoft Edge that ships with Windows
 * (no browser download); in CI it uses Playwright's Chromium (`npx playwright install chromium`).
 *
 * To test the deployed site instead: `$env:E2E_BASE_URL = "https://rue-mira.mahmoudanwari.com"; npm run test:e2e`
 */
const liveUrl = process.env.E2E_BASE_URL?.replace(/\/$/, "");
const channel = process.env.CI ? undefined : (process.env.PW_CHANNEL ?? "msedge");

export default defineConfig({
  testDir: "tests/e2e",
  timeout: liveUrl ? 90_000 : 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: liveUrl ?? "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel, viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: liveUrl
    ? undefined
    : {
        command: "node scripts/serve-out.mjs 4173",
        url: "http://localhost:4173/en/",
        reuseExistingServer: !process.env.CI,
      },
});
