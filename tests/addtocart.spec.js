import { test, expect } from "@playwright/test";

test.describe("Add to Cart Tests", () => {
  async function login(page) {
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
  }

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
  });

  test("Add item to cart", async ({ page }) => {
    await login(page);

    await page.getByRole("button", { name: "Add to cart" }).first().click();

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText("1");

    await cartBadge.click();
    await expect(page.locator(".cart_item")).toHaveCount(1);
  });
});
