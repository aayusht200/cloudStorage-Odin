import { expect, test } from "@playwright/test";
test.describe("Theme", () => {
  test("should switch between light and dark", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    const themeButton = page.getByRole("button", { name: "Toggle theme" });
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await expect(page.getByRole("menuitem", { name: "Light" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveClass(/light/);
  });
  test("should presists selected theme after reload", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page
      .getByRole("button", {
        name: "Toggle theme",
      })
      .click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveClass(/light/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/light/);
  });
  test.describe("System theme", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: "Toggle theme" }).click();
      await page.getByRole("menuitem", { name: "System" }).click();
    });
    test.describe("System theme dark", () => {
      test.use({ colorScheme: "dark" });
      test("should follow system set dark theme", async ({ page }) => {
        await page.reload();
        await expect(page.locator("html")).toHaveClass(/dark/);
      });
    });
    test.describe("System theme light", () => {
      test.use({ colorScheme: "light" });
      test("should follow system set light theme", async ({ page }) => {
        await page.reload();
        await expect(page.locator("html")).toHaveClass(/light/);
      });
    });
  });
});
