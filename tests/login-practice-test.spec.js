import { test, expect } from "@playwright/test";

test.describe("SauceDemo Login & Cart Suite", () => {
  // Runs before every test inside this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    // ensure the page is fully loaded and network is idle to avoid flakiness
    await page.waitForLoadState("networkidle");
  });

  async function login(
    page,
    username = "standard_user",
    password = "secret_sauce"
  ) {
    // use stable data-test attributes and explicit wait for visibility
    const userInput = page.locator('[data-test="username"]');
    const passInput = page.locator('[data-test="password"]');
    await userInput.waitFor({ state: "visible", timeout: 10000 });
    await userInput.fill(username);
    await passInput.fill(password);
    await page.getByRole("button", { name: "Login" }).click();
  }

  test("Valid Login", async ({ page }) => {
    await login(page);

    //assertion to verify successful login
    await expect(page).toHaveURL(/inventory.html$/);
  });

  test("Invalid Password", async ({ page }) => {
    await login(page, "standard_user", "invalid_password");

    //assertion to verify error message
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Username and password do not match any user in this service"
    );
  });

  test("Empty Username", async ({ page }) => {
    await login(page, "", "secret_sauce");

    //assertion to verify error message
    await expect(page.locator('[data-test="error"]')).toContainText(
      "Username is required"
    );
  });

  test("Logout flow", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: /open menu/i }).click();
    await page.getByRole("link", { name: "Logout" }).click();

    // Assertion to verify successful logout
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });

  test("Verify add to cart functionality", async ({ page }) => {
    await login(page);
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    // Wait for cart badge to appear
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText("1");
    // Go to cart page
    await cartBadge.click();
    // Verify item is in cart
    const cartItems = await page.locator(".cart_item").count();
    expect(cartItems).toBe(1);
    await page.getByRole("button", { name: /open menu/i }).click();
    await page.getByRole("link", { name: "Logout" }).click();

    // Assertion 3: User logged out successfully
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});
