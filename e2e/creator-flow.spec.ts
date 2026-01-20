import { expect, test } from "@playwright/test";

import { e2eLogin, getPublicPageHrefFromDashboard } from "./helpers";

test("creator can edit blocks, capture leads, and see analytics", async ({
  page,
}) => {
  const email = `creator-${Date.now()}@example.com`;

  await e2eLogin(page, email);

  await page.goto("/app/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await page.getByLabel("Display name").fill("E2E Creator");
  await page.getByRole("button", { name: "Save profile" }).click();

  await page.goto("/app");
  const publicHref = await getPublicPageHrefFromDashboard(page);

  await page.goto("/app/editor");
  await expect(page.getByRole("heading", { name: "Editor" })).toBeVisible();

  // Update the first link block to a known tracked destination.
  const linkCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: "link" })
    .first();
  await linkCard.locator('input[name="title"]').fill("My Link");
  await linkCard
    .locator('input[name="url"]')
    .fill("https://example.com/?e2e=1");
  await linkCard.getByRole("button", { name: "Save" }).click();

  // Enable the default signup block (provisioned disabled).
  const signupCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: "signup" })
    .first();
  const enableButton = signupCard.getByRole("button", { name: "Enable" });
  if (await enableButton.isVisible()) {
    await enableButton.click();
  }

  // Add a contact block.
  await page.getByRole("button", { name: "+ Contact" }).click();
  const contactCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: "contact" })
    .first();
  await contactCard.locator('input[name="title"]').fill("Contact me");
  await contactCard.getByRole("button", { name: "Save" }).click();

  // Public page reflects changes.
  await page.goto(publicHref);
  await expect(page.getByText("E2E Creator")).toBeVisible();
  await expect(page.getByText("My Link")).toBeVisible();

  // Tracked redirect exists and points to destination without navigating away.
  const trackedHref = await page
    .getByRole("link", { name: "My Link" })
    .getAttribute("href");
  expect(trackedHref).toBeTruthy();

  const trackedResponse = await page.request.get(trackedHref as string, {
    maxRedirects: 0,
  });
  expect(trackedResponse.status()).toBeGreaterThanOrEqual(300);
  expect(trackedResponse.status()).toBeLessThan(400);
  const location = trackedResponse.headers().location ?? "";
  expect(location).toContain("https://example.com/?e2e=1");

  // Submit contact lead.
  const contactForm = page.locator('form[action*="kind=contact"]').first();
  await contactForm.locator('input[name="email"]').fill(email);
  await contactForm.locator('textarea[name="message"]').fill("Hello from e2e");
  await contactForm.getByRole("button", { name: "Send" }).click();
  await expect(page).toHaveURL(/submitted=1/);

  // Submit signup lead.
  const signupForm = page.locator('form[action*="kind=signup"]').first();
  await signupForm.locator('input[name="email"]').fill(email);
  await signupForm.getByRole("button", { name: "Subscribe" }).click();
  await expect(page).toHaveURL(/submitted=1/);

  // Lead shows up in inbox.
  await page.goto("/app/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
  await expect(page.getByText(email).first()).toBeVisible();
  await expect(page.getByText("Hello from e2e")).toBeVisible();

  // Analytics shows the destination we clicked.
  await page.goto("/app/analytics");
  await expect(page.getByRole("heading", { name: "Analytics" })).toBeVisible();
  await expect(page.getByText("https://example.com/?e2e=1")).toBeVisible();
});
