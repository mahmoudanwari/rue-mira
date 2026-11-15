import { expect, test } from "@playwright/test";

test("quick add (one size) and quick view from product cards", async ({ page }) => {
  await page.goto("/en/collections/handbags/");
  const card = page.getByRole("article", { name: "Talia Canvas Tote" });
  await card.hover();
  await card.getByRole("button", { name: /Quick add/ }).click();
  await expect(page.getByTestId("bag-count")).toHaveText("1");

  await card.getByRole("button", { name: "Quick view: Talia Canvas Tote" }).click();
  const dialog = page.getByRole("dialog", { name: "Quick view: Talia Canvas Tote" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Talia Canvas Tote", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("product images load as WebP, and fall back to the original PNG if a copy fails", async ({ page }) => {
  await page.goto("/en/products/solene-midi-dress/");
  const main = page.getByRole("img", { name: "Solène Midi Dress in Burgundy" }).first();
  await expect(main).toHaveJSProperty("complete", true);
  expect(await main.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/images-webp\/.*\.webp$/);

  await page.route(/images-webp\/.*01-rm-001-solene-midi-dress-main/, (route) => route.fulfill({ status: 404, body: "" }));
  await page.reload();
  const fallback = page.getByRole("img", { name: "Solène Midi Dress in Burgundy" }).first();
  await expect.poll(() => fallback.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.png$/);
  await expect.poll(() => fallback.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator('[data-missing-asset*="01-rm-001"]')).toHaveCount(0);
});

test("quick add on a sized product asks for a size", async ({ page }) => {
  await page.goto("/en/collections/shoes/");
  const card = page.getByRole("article", { name: "Elle Ballet Flats" });
  await card.hover();
  await card.getByRole("button", { name: /Quick add/ }).click();
  const sizes = card.getByRole("group", { name: /Select a size/ });
  await expect(sizes.getByRole("button", { name: /36 — out of demo stock/ })).toBeDisabled();
  await sizes.getByRole("button", { name: "Size 38" }).click();
  await expect(page.getByTestId("bag-count")).toHaveText("1");
});

test("gallery switches views with arrow keys and opens the zoom dialog", async ({ page }) => {
  await page.goto("/en/products/camille-blouse/");
  const tabs = page.getByRole("tablist", { name: "Product images" });
  await expect(tabs.getByRole("tab", { name: "Main view" })).toHaveAttribute("aria-selected", "true");
  await tabs.getByRole("tab", { name: "Main view" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Detail view" })).toHaveAttribute("aria-selected", "true");

  await page.getByRole("button", { name: "Zoom image" }).click();
  const zoom = page.getByRole("dialog", { name: /enlarged/ });
  await expect(zoom).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(zoom).toBeHidden();
});

test("a Demo Studio price edit shows across the shop", async ({ page }) => {
  await page.goto("/en/demo-studio/");
  const price = page.getByLabel("Price (€): Mina Ribbed Tee");
  await price.fill("15");
  await price.press("Enter");
  await page.goto("/en/products/mina-ribbed-tee/");
  await expect(page.getByText("€15.00").first()).toBeVisible();
  await expect(page.getByText("Price edited in Demo Studio")).toBeVisible();
});

test("a demo order reduces local demo stock", async ({ page }) => {
  await page.goto("/en/products/nia-pendant-necklace/");
  await expect(page.getByText("12 left in demo stock")).toBeVisible();
  await page.getByTestId("add-to-bag").click();
  await page.goto("/en/checkout/");
  for (let i = 0; i < 3; i++) await page.getByTestId("checkout-next").click(); // bag → delivery → method → payment
  await page.getByLabel("Simulated card payment").check();
  await page.getByTestId("checkout-next").click();
  await page.getByTestId("place-order").click();
  await expect(page.getByTestId("order-code")).toBeVisible();
  await page.goto("/en/products/nia-pendant-necklace/");
  await expect(page.getByText("11 left in demo stock")).toBeVisible();
});
