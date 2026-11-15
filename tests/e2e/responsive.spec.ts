import { expect, test } from "./fixtures";

const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const PAGES = ["/en/", "/nl/shop/", "/fr/products/esme-cropped-trench/", "/en/lookbook/", "/en/checkout/", "/en/demo-studio/"];

test("no horizontal overflow at the target widths", async ({ page }) => {
  test.setTimeout(240_000);
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of PAGES) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} @ ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("mobile menu and filter drawer work by touch-sized controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/shop/");
  await page.getByRole("button", { name: "Filter & sort" }).click();
  const drawer = page.getByRole("dialog", { name: "Filters" });
  await expect(drawer).toBeVisible();
  await drawer.getByTestId("mob-cat-shoes").check();
  await drawer.getByRole("button", { name: /Show 5 results/ }).click();
  await expect(page.getByTestId("result-count")).toHaveText("5 results");

  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Lookbook" }).click();
  await expect(page).toHaveURL(/\/en\/lookbook\/$/);
});
