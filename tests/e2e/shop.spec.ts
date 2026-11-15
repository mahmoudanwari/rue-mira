import { expect, test } from "@playwright/test";

test.describe("languages", () => {
  test("gateway offers three languages and remembers the choice", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Nederlands/ })).toBeVisible();
    await page.getByRole("link", { name: /Nederlands/ }).click();
    await expect(page).toHaveURL(/\/nl\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "nl-BE");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Gemaakt voor elke dag");
    // Returning to the gateway sends us to the remembered language.
    await page.goto("/");
    await expect(page).toHaveURL(/\/nl\/$/);
  });

  test("switching language keeps the equivalent product page", async ({ page }) => {
    await page.goto("/en/products/solene-midi-dress/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Solène Midi Dress");
    await page.locator('a[hreflang="fr"][lang="fr"]').first().click();
    await expect(page).toHaveURL(/\/fr\/products\/solene-midi-dress\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Robe midi Solène");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr-BE");
  });

  test("every locale renders checkout and demo studio", async ({ page }) => {
    for (const l of ["en", "nl", "fr"]) {
      await page.goto(`/${l}/demo-studio/`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demo Studio");
      await page.goto(`/${l}/checkout/`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});

test("search overlay suggests products and opens one with the keyboard", async ({ page }) => {
  await page.goto("/en/");
  await page.getByRole("button", { name: "Search" }).click();
  const box = page.getByRole("combobox");
  await expect(box).toBeFocused();
  await box.fill("celeste");
  await expect(page.getByRole("option")).toHaveCount(1);
  await box.press("ArrowDown");
  await box.press("Enter");
  await expect(page).toHaveURL(/celeste-cardigan/);
});

test("shop filters compose, update the count and the shareable URL", async ({ page }) => {
  await page.goto("/en/shop/");
  await expect(page.getByTestId("result-count")).toHaveText("32 results");
  await page.getByTestId("desk-cat-dresses").check();
  await expect(page.getByTestId("result-count")).toHaveText("6 results");
  await page.getByTestId("desk-price-max").fill("50");
  await expect(page.getByTestId("result-count")).toHaveText("2 results");
  await expect(page).toHaveURL(/category=dresses/);
  await expect(page).toHaveURL(/max=50/);
  await page.getByTestId("sort").selectOption("price-asc");
  await expect(page.locator("main article h3").first()).toHaveText("Iris Floral Tea Dress");
  // The URL restores the same view.
  await page.reload();
  await expect(page.getByTestId("result-count")).toHaveText("2 results");
  await page.getByTestId("clear-all").click();
  await expect(page.getByTestId("result-count")).toHaveText("32 results");
});

test("product page requires a size, then adds to bag", async ({ page }) => {
  await page.goto("/en/products/ren-tailored-trousers/");
  await page.getByTestId("add-to-bag").click();
  await expect(page.getByText("Please choose a size first.")).toBeVisible();
  await page.getByRole("radio", { name: "M" }).click();
  await page.getByTestId("add-to-bag").click();
  await expect(page.getByTestId("bag-count")).toHaveText("1");
  await expect(page.getByTestId("bag-toast")).toBeVisible();
  // Sold-out sizes cannot be selected.
  await page.goto("/en/products/alba-wide-leg-jeans/");
  await expect(page.getByRole("radio", { name: /24 — out of demo stock/ })).toHaveAttribute("aria-disabled", "true");
});

test("wishlist persists across pages", async ({ page }) => {
  await page.goto("/en/collections/jewellery/");
  await page.getByRole("button", { name: "Add to wishlist: Lyra Hoop Earrings" }).click();
  await page.goto("/en/wishlist/");
  await expect(page.getByRole("heading", { name: "Lyra Hoop Earrings" })).toBeVisible();
});

test("compare shows a meaningful table and caps at four", async ({ page }) => {
  await page.goto("/en/shop/");
  for (const name of ["Solène Midi Dress", "Elia Shirt Dress", "Liora Slip Dress", "Noa Knit Column Dress"]) {
    await page.getByRole("button", { name: `Add to compare: ${name}` }).click();
  }
  await page.getByRole("button", { name: "Add to compare: Iris Floral Tea Dress" }).click();
  await expect(page.getByRole("complementary", { name: "Compare tray" }).getByRole("listitem")).toHaveCount(4);
  await page.goto("/en/compare/");
  const table = page.getByTestId("compare-table");
  await expect(table.locator("thead th")).toHaveCount(5);
  await expect(table).toContainText("linen-blend");
  await expect(table).toContainText("€69.00");
});

test("size guide drawer opens, closes with Escape and returns focus", async ({ page }) => {
  await page.goto("/en/products/amara-wrap-dress/");
  const trigger = page.getByRole("button", { name: "Size guide" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Size guide" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("table").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("demo checkout completes with no payment inputs and creates a DEMO order", async ({ page }) => {
  await page.goto("/en/products/cleo-mini-bag/");
  await page.getByTestId("add-to-bag").click();
  await expect(page.getByTestId("bag-count")).toHaveText("1");
  await page.goto("/en/bag/");
  await page.getByLabel("Promo code").fill("mira10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("MIRA10 applied")).toBeVisible();
  await page.getByTestId("to-checkout").click();

  await expect(page.getByText("This is a simulated checkout.")).toBeVisible();
  await page.getByTestId("checkout-next").click(); // bag -> delivery
  await expect(page.getByLabel("Email")).toHaveValue("lena.demo@example.com");
  await page.getByLabel("Postcode").fill("12");
  await page.getByTestId("checkout-next").click();
  await expect(page.getByText("Belgian postcodes have 4 digits.")).toBeVisible();
  await page.getByLabel("Postcode").fill("1050");
  await page.getByTestId("checkout-next").click(); // -> method
  await page.getByLabel(/Pickup point/).check();
  await page.getByTestId("checkout-next").click(); // -> payment

  // No card / IBAN fields anywhere.
  await expect(page.locator('input[autocomplete^="cc-"], input[name*="card" i], input[name*="iban" i]')).toHaveCount(0);
  await page.getByTestId("checkout-next").click();
  await expect(page.getByText("This field is required.")).toBeVisible();
  await page.getByLabel("Simulated banking app").check();
  await page.getByTestId("checkout-next").click(); // -> review
  // €38.00 − 10% (€3.80) + €2.95 pickup = €37.15
  await expect(page.getByTestId("place-order")).toContainText("€37.15");
  await page.getByTestId("place-order").click();

  await expect(page).toHaveURL(/order-confirmation\/\?code=DEMO-RM-/);
  await expect(page.getByTestId("order-code")).toHaveText(/^DEMO-RM-[A-Z0-9]{6}$/);
  await expect(page.getByTestId("bag-count")).toHaveCount(0);
  // Personal data is never persisted.
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  expect(stored).not.toContain("lena.demo");
  expect(stored).not.toContain("1050");
});

test("demo studio edits are local and reset restores the seed", async ({ page }) => {
  await page.goto("/en/demo-studio/");
  await page.getByRole("switch", { name: "Toggle visibility for Solène Midi Dress" }).click();
  await page.goto("/en/shop/");
  await expect(page.getByTestId("result-count")).toHaveText("31 results");
  await page.goto("/en/demo-studio/");
  await page.getByTestId("reset-demo").click();
  await page.getByTestId("confirm-reset").click();
  await page.goto("/en/shop/");
  await expect(page.getByTestId("result-count")).toHaveText("32 results");
});

test("a missing photo shows a neutral placeholder instead of a broken image", async ({ page }) => {
  await page.route(/01-rm-001-solene-midi-dress-main/, (route) => route.fulfill({ status: 404, body: "" }));
  await page.goto("/en/products/solene-midi-dress/");
  await expect(page.locator('[data-missing-asset*="01-rm-001"]').first()).toBeVisible();
});

test("unknown URLs return the 404 page", async ({ page }) => {
  const res = await page.goto("/en/does-not-exist/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("different street");
});
