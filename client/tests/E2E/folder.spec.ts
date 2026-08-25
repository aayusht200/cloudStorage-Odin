import { expect, test } from "@playwright/test";
import axios from "axios";
import { type SignupPayload } from "../../src/schema/auth";
import createSignupPayload from "./createSignupPayload";
test.describe("Folder", () => {
  let payload: SignupPayload;
  let folderName: string;
  test.beforeEach(async ({ page }) => {
    payload = createSignupPayload();
    folderName = `test-folder-${crypto.randomUUID()}`;
    await axios.post("http://localhost:3000/api/users/signup", payload);

    await page.goto("/login");
    await page.getByRole("textbox", { name: "Email" }).fill(payload.email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(payload.password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/drive\/[^/]+$/);
  });
  test("should create a folder via the create folder button", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Create Folder" }).click();
    const form = page.getByLabel("Create Folder");
    await expect(form.getByRole("button", { name: "Create" })).toBeVisible();
    const createButton = form.getByRole("button", { name: "Create" });
    await form.getByRole("textbox", { name: "Folder Name" }).fill(folderName);
    await createButton.click();
    await expect(page.getByRole("button", { name: folderName })).toBeVisible();
  });
  test("should open the folder when clicked on folder card", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Create Folder" }).click();
    const form = page.getByLabel("Create Folder");
    await form.getByRole("textbox", { name: "Folder Name" }).fill(folderName);
    await form.getByRole("button", { name: "Create" }).click();
    const folder = page.getByRole("button", { name: folderName });
    await expect(folder).toBeVisible();
    await folder.click();
    await expect(
      page.getByRole("button", { name: "Upload Files" }),
    ).toBeVisible();
  });
  test("should delete a folder and navigate/reload the current directory", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Create Folder" }).click();
    const form = page.getByLabel("Create Folder");
    await form.getByRole("textbox", { name: "Folder Name" }).fill(folderName);
    await form.getByRole("button", { name: "Create" }).click();
    const folder = page.getByRole("button", { name: folderName });
    await expect(folder).toBeVisible();
    await folder.hover();
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).click();
    const reload = page.waitForEvent("load");
    await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();
    await page.getByRole("button", { name: "Confirm" }).click();
    await reload;
    await expect(
      page.getByRole("button", { name: folderName }),
    ).not.toBeVisible();
  });
});
