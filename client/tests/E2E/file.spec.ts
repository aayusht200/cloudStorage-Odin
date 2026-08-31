import { expect, test } from "@playwright/test";
import axios from "axios";
import { SignupPayload } from "../../src/schema/auth";
import createSignupPayload from "./createSignupPayload";

test.describe("files", () => {
  let payload: SignupPayload;
  const currentDir = new URL(".", import.meta.url).pathname;
  const targetFile = `${currentDir}/test.png`;
  test.beforeEach(async ({ page }) => {
    payload = createSignupPayload();
    await axios.post("http://localhost:3000/api/users/signup", payload);
    await page.goto("/login");
    await page.getByRole("textbox", { name: "Email" }).fill(payload.email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(payload.password);
    await page.getByRole("button", { name: "Login" }).click();
    page.on("response", (response) => {
      if (response.url().includes("/api/")) {
        console.log("API:", response.status(), response.url());
      }
    });
    await expect(page).toHaveURL(/\/drive\/[^/]+$/);
  });
  test.describe("File uploads", () => {
    test("should upload a file via upload button from header and return to the current directory", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Upload", exact: true }).click();
      const form = page.getByRole("form", { name: "Upload form" });
      await expect(form.getByLabel("file")).toBeVisible();
      await form.getByLabel("file").setInputFiles(targetFile);
      await form.getByRole("button", { name: "Upload" }).click();
      await expect(page.getByText("test.png")).toBeVisible();
    });
    test("should upload a file via Upload file when empty drive and return to the current directory", async ({
      page,
    }) => {
      await page
        .getByRole("button", { name: "Upload Files", exact: true })
        .click();
      const form = page.getByRole("form", { name: "Upload form" });
      await expect(form.getByLabel("file")).toBeVisible();
      await form.getByLabel("file").setInputFiles(targetFile);
      await form.getByRole("button", { name: "Upload" }).click();
      await expect(page.getByText("test.png")).toBeVisible();
    });
  });
  test.describe("File actions", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .getByRole("button", { name: "Upload Files", exact: true })
        .click();
      const form = page.getByRole("form", { name: "Upload form" });
      await expect(form.getByLabel("file")).toBeVisible();
      await form.getByLabel("file").setInputFiles(targetFile);
      await form.getByRole("button", { name: "Upload" }).click();
      await expect(page.getByText("test.png")).toBeVisible();
    });
    test("should open the file when clicked on it with the file info", async ({
      page,
    }) => {
      await page.getByText("test.png").click();
      await expect(page.getByText("Name: test.png")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Copy file link" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Delete file" }),
      ).toBeVisible();
    });
    test("should copy the share link when the share button is clicked", async ({
      page,
    }) => {
      await page
        .context()
        .grantPermissions(["clipboard-read", "clipboard-write"]);
      await page.getByText("test.png").click();
      await page.getByRole("button", { name: "Copy file link" }).click();
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      const url = new URL(clipboard);
      expect(url.hostname).toMatch(/\.storage\.supabase\.co$/);
    });
    test("should delete the file and return to currrent directory", async ({
      page,
    }) => {
      await page.getByText("test.png").click();
      await expect(page.getByText("Name: test.png")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Delete file" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Delete file" }).click();
      await expect(page.getByText("test.png")).toHaveCount(0);
    });
  });
});
