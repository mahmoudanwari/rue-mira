import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/**
 * Same as Playwright's test, but page.goto() on a shop page (/en/, /nl/, /fr/…) also waits until
 * the page is interactive, so tests never click before React has hydrated (matters on the
 * slower live site).
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const res = await goto(url, options);
      if (/^\/(en|nl|fr)\//.test(url) && res?.status() === 200) {
        await page.waitForSelector("html[data-hydrated]", { state: "attached" });
      }
      return res;
    };
    await provide(page);
  },
});
