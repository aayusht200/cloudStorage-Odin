import { expect, test } from "@playwright/test";

test("should load the application", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CloudDrive/i);
});
