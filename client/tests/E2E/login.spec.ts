import { expect, test } from "@playwright/test";
import axios from "axios";
import createSignupPayload from "./createSignupPayload";
test("should navigate to homepage on succesfull login", async ({ page }) => {
  const payload = createSignupPayload();
  await axios.post("http://localhost:3000/api/users/signup", payload);
  page.on("response", async (response) => {
    if (response.url().includes("/api/")) {
      console.log("API:", response.status(), response.url());
    }
  });
  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill(payload.email);
  await page.getByRole("textbox", { name: "Password" }).fill(payload.password);
  await page.getByRole("button", { name: "Login" }).click();
  console.log("URL:", page.url());

  await expect(page).toHaveURL(/\/drive\/[^/]+$/);

});
