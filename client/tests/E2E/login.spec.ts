import { expect, test } from "@playwright/test";
import axios from "axios";
import createSignupPayload from "./createSignupPayload";
test("should navigate to homepage on succesfull login", async ({ page }) => {
  const payload = createSignupPayload();
  await axios.post("http://localhost:3000/api/users/signup", payload);

  await page.goto("/login");
  console.log("URL:", page.url());
  console.log("TITLE:", await page.title());
  console.log("BODY:", await page.locator("body").innerText());
  await page.getByRole("textbox", { name: "Email" }).fill(payload.email);
  await page.getByRole("textbox", { name: "Password" }).fill(payload.password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/drive\/[^/]+$/);
});
