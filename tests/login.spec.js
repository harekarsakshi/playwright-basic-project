import { test, expect } from "@playwright/test";

test.describe("Login Tests", () => {

  async function login(page, username = "standard_user", password = "secret_sauce") {
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.getByRole("button", { name: "Login" }).click();
  }

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
  });

  test("Valid Login", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/inventory.html$/);
  });

  test("Invalid Password", async ({ page }) => {
    await login(page, "standard_user", "wrong_pass");
    await expect(page.locator('[data-test="error"]'))
      .toContainText("Username and password do not match any user in this service");
  });

  test("Empty Username", async ({ page }) => {
    await login(page, "", "secret_sauce");
    await expect(page.locator('[data-test="error"]'))
      .toContainText("Username is required");
  });

});