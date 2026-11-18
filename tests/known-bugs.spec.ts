import { test, expect } from '../fixtures/test';
import { PRODUCTS } from '../data/catalog';
import { newUser, ADMIN } from '../data/users';

test.describe('Known bugs', { tag: '@known-bug' }, () => {
  test('BUG-001 "Add to cart" button on product cards is not reachable with the keyboard', async ({ page, categoryPage }) => {
    test.fail();
    await categoryPage.openCategory('men');
    const card = categoryPage.product(PRODUCTS.diorSauvage.title);

    await card.imageLink.focus();
    await page.keyboard.press('Tab');

    await expect(card.addToCartButton).toBeFocused({ timeout: 3_000 });
    await expect(card.addToCartButton).toBeVisible();
  });

  test('BUG-002 Cart heading shows number of rows instead of number of items', async ({ categoryPage, cartPage }) => {
    test.fail();
    await categoryPage.openCategory('men');
    const card = categoryPage.product(PRODUCTS.diorSauvage.title);
    await card.addToCart();
    await card.addToCart();
    await card.addToCart();

    await cartPage.open();
    await cartPage.expectCartBadge(3);
    await expect(cartPage.heading).toHaveText('Кошик (3)');
  });

  test('BUG-003 Search does not work', async ({ page, categoryPage }) => {
    test.fail();
    await categoryPage.openCategory('men');
    await categoryPage.searchInput.fill('Ray-Ban');
    await categoryPage.searchInput.press('Enter');
    await categoryPage.waitForAppReady();

    await expect(page).not.toHaveURL(/#\/$/, { timeout: 3_000 });
    const titles = await page.locator('main .product-card h6').allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    for (const t of titles) expect(t).toContain('Ray-Ban');
  });

  test('BUG-004 Registration accepts an invalid email format', async ({ page, registerPage }) => {
    test.fail();
    await registerPage.open();
    await registerPage.register(newUser({ email: 'not-an-email' }));

    await expect(page).toHaveURL(/#\/register$/, { timeout: 3_000 });
  });

  test('BUG-005 Login is case-sensitive to email', async ({ page, loginPage }) => {
    test.fail();
    await loginPage.open();
    await loginPage.login(ADMIN.email.toUpperCase(), ADMIN.password);
    await expect(page).toHaveURL(/#\/home$/, { timeout: 3_000 });
  });

  test('BUG-006 Registration with an existing email still redirects to the login page', async ({ page, registerPage }) => {
    test.fail();
    await registerPage.open();
    await registerPage.register(newUser({ email: ADMIN.email }));
    await registerPage.expectToast('Користувач з таким email вже існує');

    await expect(page).toHaveURL(/#\/register$/);
  });

  test('BUG-007 Password is stored in plain text in localStorage', async ({ page, loginPage }) => {
    test.fail();
    await loginPage.open();
    await loginPage.login(ADMIN.email, ADMIN.password);
    await expect(page).toHaveURL(/#\/home$/);

    const activeUser = await page.evaluate(() => JSON.parse(localStorage.getItem('active_user') ?? '{}'));
    expect(activeUser.password).toBeUndefined();
  });
});
