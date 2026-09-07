import { mkdir } from "node:fs/promises";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const screenshotDir = path.resolve("qa-reports/frontend-full-audit/screenshots");
const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
] as const;
const auditViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;
const publicRoutes = [
  "/",
  "/get-started",
  "/contact",
  "/students",
  "/instructors",
  "/how-it-works",
  "/help",
  "/privacy",
  "/terms",
  "/cookies",
  "/auth/student/login",
  "/auth/student/register",
  "/auth/instructor/login",
  "/auth/instructor/register",
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectEnglishDocument(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("body")).not.toContainText(/[\u0600-\u06ff]/);
}

test.beforeAll(async () => {
  await mkdir(screenshotDir, { recursive: true });
});

test("home has no horizontal overflow across the full viewport matrix", async ({ page }) => {
  test.setTimeout(120_000);
  for (const viewport of auditViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectEnglishDocument(page);
    await expectNoHorizontalOverflow(page);
  }
});

for (const viewport of viewports) {
  test(`home is responsive and English-only on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    await expectEnglishDocument(page);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /switch.*language|arabic/i })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(screenshotDir, `en-home-${viewport.name}.png`), fullPage: true });
  });

  for (const route of ["get-started", "contact", "students", "instructors", "how-it-works"] as const) {
    test(`${route} renders in English without overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/${route}`, { waitUntil: "networkidle" });
      await expectEnglishDocument(page);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("footer")).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
      await page.screenshot({ path: path.join(screenshotDir, `en-${route}-${viewport.name}.png`), fullPage: true });
    });
  }
}

test("all public routes render English-only content on unprefixed URLs", async ({ page }) => {
  test.setTimeout(120_000);
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expectEnglishDocument(page);
    expect(new URL(page.url()).pathname).not.toMatch(/^\/(?:ar|en)(?:\/|$)/);
  }
});

test("representative public pages have no serious axe violations", async ({ page }) => {
  for (const route of ["/", "/get-started", "/contact", "/students", "/instructors", "/how-it-works", "/auth/student/login"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const important = results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
    expect(important, important.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
  }
});

test("authentication and 404 visual states are English-only", async ({ page }) => {
  test.setTimeout(90_000);
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const routes = [
      { path: "/auth/student/login", name: "login" },
      { path: "/auth/student/register", name: "registration" },
      { path: "/auth/student/password-reset/request", name: "forgot-password" },
      { path: "/route-that-does-not-exist", name: "404" },
    ];
    for (const route of routes) {
      await page.goto(route.path, { waitUntil: "load" });
      await expectEnglishDocument(page);
      await expect(page.locator("h1").first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await page.screenshot({ path: path.join(screenshotDir, `en-${route.name}-${viewport.name}.png`), fullPage: true });
    }
  }
});

test("mobile navigation and skip link are keyboard accessible", async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" }).first()).toBeVisible();
});

test("unknown route shows the product 404", async ({ page }) => {
  const response = await page.goto("/route-that-does-not-exist", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("protected routes redirect anonymous users to the correct unprefixed login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/auth\/student\/login\?next=/);
  await page.goto("/instructor/tasks");
  await expect(page).toHaveURL(/\/auth\/instructor\/login\?next=/);
});

test("legacy locale-prefixed URLs permanently redirect to unprefixed English URLs", async ({ page }) => {
  await page.goto("/ar/contact");
  await expect(page).toHaveURL(/\/contact$/);
  await expectEnglishDocument(page);

  await page.goto("/en/how-it-works");
  await expect(page).toHaveURL(/\/how-it-works$/);
  await expectEnglishDocument(page);
});
