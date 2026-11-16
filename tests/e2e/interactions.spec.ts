import { expect, test } from "./fixtures";

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

test("footer credits the designer in every language", async ({ page }) => {
  const lines = { en: "Designed & developed by", nl: "Ontworpen & ontwikkeld door", fr: "Conçu & développé par" };
  for (const [l, line] of Object.entries(lines)) {
    await page.goto(`/${l}/`);
    const credit = page.getByTestId("designer-credit");
    await expect(credit).toContainText(line);
    await expect(credit.getByRole("link", { name: /Mahmoud Anwari/ })).toHaveAttribute("href", "https://mahmoudanwari.com");
  }
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Mahmoud Anwari" })).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`banner, weekend and newsletter photos are not cropped @${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const cropOf = (file: string) =>
      page.evaluate((f) => {
        const img = [...document.images].find((i) => (i.currentSrc || i.src).includes(f));
        if (!img || !img.naturalWidth) return -1;
        const b = img.getBoundingClientRect();
        const ia = img.naturalWidth / img.naturalHeight, ba = b.width / b.height;
        return Math.round((ia > ba ? 1 - ba / ia : 1 - ia / ba) * 100);
      }, file);
    await page.goto("/en/collections/dresses/");
    await expect.poll(() => cropOf("65-category-dresses")).toBeGreaterThanOrEqual(0);
    expect(await cropOf("65-category-dresses")).toBeLessThanOrEqual(10);
    await page.goto("/en/");
    for (const f of ["76-home-weekend-edit", "82-home-newsletter"]) {
      await page.locator(`img[src*="${f}"]`).scrollIntoViewIfNeeded();
      await expect.poll(() => cropOf(f)).toBeGreaterThanOrEqual(0);
      expect(await cropOf(f), f).toBeLessThanOrEqual(10);
    }
  });
}

test("phones: product-card buttons stay off the top (face) area of the photo", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/shop/");
  const card = page.getByRole("article").first();
  const img = await card.locator("img").first().boundingBox();
  for (const btn of await card.getByRole("button").all()) {
    const b = await btn.boundingBox();
    if (!b) continue;
    expect(b.y, "button over the upper half of the photo").toBeGreaterThan(img!.y + img!.height * 0.5);
  }
});

test("phones: the hero headline starts below the model's face", async ({ page }) => {
  for (const [w, h] of [[360, 740], [390, 844], [430, 932]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/nl/");
    await page.waitForTimeout(1600); // let the headline reveal finish
    const photo = await page.locator("main section").first().locator("img").first().boundingBox();
    const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
    // The face sits in the top ~35% of the 4:5 phone photo.
    expect(h1!.y, `${w}x${h}`).toBeGreaterThan(photo!.y + photo!.height * 0.45);
  }
});

test("laptops: the main product photo fits on screen", async ({ page }) => {
  for (const [w, h] of [[1280, 720], [1366, 768], [1440, 900]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/fr/products/esme-cropped-trench/");
    const box = await page.locator('section[aria-roledescription="carousel"] [aria-roledescription="slide"]').boundingBox();
    expect(box!.y + box!.height, `${w}x${h}`).toBeLessThanOrEqual(h);
  }
});
