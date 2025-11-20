// @ts-check
import { test, expect } from "@playwright/test";

test("fingerprintTest", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  // page.on("console", (msg) => {
  //   console.log("Browser console:", msg.text());
  // });

  await page.waitForTimeout(10_000)

  
  await page.getByRole("heading", { name: /Id:/ }).waitFor({ timeout: 20000 });
  await page
    .getByRole("heading", { name: /Risk:/ })
    .waitFor({ timeout: 20000 });

  const token = await page.getByRole("heading", { name: /Id:/ }).innerText();
  const riskRate = await page
    .getByRole("heading", { name: /Risk:/ })
    .innerText();

  // // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);

  console.log(`token -> ${token}`);
  console.log(`risk -> ${riskRate}`);

  // await expect(page.getByRole("heading", { name: /Id:/ })).toBeVisible();
  // await expect(page.getByRole("heading", { name: /Risk:/ })).toBeVisible();
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
