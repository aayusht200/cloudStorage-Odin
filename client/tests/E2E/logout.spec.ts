import { expect, test } from "@playwright/test";
import axios from "axios";
import createSignupPayload from "./createSignupPayload";
test("should logout the user and return to /login ", async ({ page }) => {
  const payload = createSignupPayload();
  await axios.post("http://localhost:3000/api/users/signup", payload);

  await page.goto("/login");
  await page.getByRole("textbox", { name: "Email" }).fill(payload.email);
  await page.getByRole("textbox", { name: "Password" }).fill(payload.password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/drive\/[^/]+$/);
  const driveUrl = page.url();

  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.goto(driveUrl);

  await expect(page).toHaveURL(/\/login/);
});
