import { test, expect } from '../fixtures/test';
import { PRODUCTS } from '../data/catalog';

const { diorSauvage, primalElement } = PRODUCTS;

test.describe('Checkout', () => {
  test.beforeEach(async ({ categoryPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await categoryPage.product(primalElement.title).addToCart();
  });

  test('TC-CHK-01 Full purchase: cart → confirm → thank-you page', { tag: ['@smoke', '@mobile'] }, async ({
    page,
    cartPage,
    thankYouPage,
  }) => {
    const total = diorSauvage.price + primalElement.price;
    await cartPage.open();
    await cartPage.checkoutButton.click();

    await expect(cartPage.modal.title).toHaveText('Підтвердження замовлення');
    await expect(cartPage.modal.message).toContainText(`${total} ₴`);
    await cartPage.modal.confirm();

    await expect(page).toHaveURL(/#\/thank-you\?order=\d{5}$/);
    await expect(thankYouPage.heading).toBeVisible();
    await expect(thankYouPage.orderNumber).toHaveText(/^#\d{5}$/);

    const orderFromUrl = new URL(page.url().replace('#/', '')).searchParams.get('order');
    await expect(thankYouPage.orderNumber).toHaveText(`#${orderFromUrl}`);

    await thankYouPage.expectCartBadge(0);
  });

  test('TC-CHK-02 Thank-you page shows recommendations and "home" button works', async ({
    page,
    cartPage,
    thankYouPage,
  }) => {
    await cartPage.open();
    await cartPage.checkout();

    await expect(thankYouPage.recommendations.first()).toBeVisible();
    await thankYouPage.homeButton.click();
    await expect(page).toHaveURL(/#\/$/);
  });

  test('TC-CHK-03 Cancel in the confirmation modal keeps the cart', async ({ page, cartPage }) => {
    await cartPage.open();
    await cartPage.checkoutButton.click();
    await cartPage.modal.cancel();

    await expect(page).toHaveURL(/#\/cart$/);
    await expect(cartPage.items).toHaveCount(2);
  });

  test('TC-CHK-04 Click outside the modal (overlay) closes it without ordering', async ({ page, cartPage }) => {
    await cartPage.open();
    await cartPage.checkoutButton.click();
    await expect(cartPage.modal.root).toBeVisible();

    await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(cartPage.modal.root).toBeHidden();
    await expect(cartPage.items).toHaveCount(2);
  });

  test('TC-CHK-05 Close (×) button closes the modal without ordering', async ({ cartPage }) => {
    await cartPage.open();
    await cartPage.checkoutButton.click();
    await cartPage.modal.closeButton.click();

    await expect(cartPage.modal.root).toBeHidden();
    await expect(cartPage.items).toHaveCount(2);
  });
});
