import { test, expect } from '../fixtures/test';
import { CATEGORIES } from '../data/catalog';

test.describe('Smoke', { tag: '@smoke' }, () => {
  test('TC-SM-01 Preloader is shown and then the home page opens', { tag: '@mobile' }, async ({ page, homePage }) => {
    await page.goto('/');
    await expect(page.locator('#root')).not.toBeEmpty();
    await homePage.waitForAppReady();

    await expect(page).toHaveTitle(/.+/);
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.carousel).toBeVisible();
    await expect(homePage.sectionHeadings.first()).toHaveText('Пропозиції брендів');
  });

  test('TC-SM-02 Header contains search, account, cart and all categories', async ({ homePage }) => {
    await homePage.open();

    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.accountLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();
    await homePage.expectCartBadge(0);

    for (const category of CATEGORIES) {
      await expect(homePage.categoryNav.getByRole('link', { name: category.name, exact: true })).toBeVisible();
    }
    await expect(homePage.categoryNav.getByRole('link', { name: 'Акції' })).toBeVisible();
  });

  test('TC-SM-03 Home page shows all product sections', async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.sectionHeadings).toHaveCount(11);
  });

  test('TC-SM-04 Logo returns the user to the home page', async ({ page, cartPage }) => {
    await cartPage.open();
    await cartPage.logo.click();
    await expect(page).toHaveURL(/#\/$/);
  });

  test('TC-SM-05 No JavaScript errors in the console on the main pages', async ({ page, homePage }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    for (const route of ['/', '/section/makeup', '/product/41', '/cart', '/auth', '/register']) {
      await page.goto(`/#${route}`);
      await homePage.waitForAppReady();
    }
    expect(errors, `Unexpected JS errors:\n${errors.join('\n')}`).toEqual([]);
  });
});
