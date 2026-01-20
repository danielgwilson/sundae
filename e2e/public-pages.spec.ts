import { expect, test } from "@playwright/test";

test("landing page and demo render", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /creator homepage/i }),
  ).toBeVisible();

  await page.getByRole("link", { name: "View demo" }).first().click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText("Demo Creator")).toBeVisible();
  await expect(page.getByText("Tip jar")).toBeVisible();
});

test("unauthenticated users are redirected to signin for /app", async ({
  page,
}) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/signin$/);
  await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
});
