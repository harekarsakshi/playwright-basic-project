import { test, expect } from "@playwright/test";

test.describe("Remove From Cart Tests", () => {
  async function login(page) {
    await page.locator('[data-test="username"]').fill("standard_user");
    await page.locator('[data-test="password"]').fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
  }

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
  });

  test("Remove item from cart", async ({ page }) => {
    await login(page);

    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await page.locator('[data-test="shopping-cart-badge"]').click();

    await page.getByRole("button", { name: "Remove" }).click();

    await expect(page.locator(".cart_item")).toHaveCount(0);
  });
});
