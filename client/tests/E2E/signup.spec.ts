import { expect, test } from "@playwright/test";
import createSignupPayload from "./createSignupPayload";
test.describe("Signup", () => {
  test("should allow a new user to sign up and reach login", async ({
    page,
  }) => {
    const payload = createSignupPayload();
    await page.goto("/signup");
    await page
      .getByRole("textbox", { name: "First Name" })
      .fill(payload.firstName);
    await page.getByLabel("Last Name").fill(payload.lastName);
    await page.getByLabel("Email").fill(payload.email);
    await page.getByLabel("Password").fill(payload.password);
    await page.getByRole("button", { name: "Signup" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
