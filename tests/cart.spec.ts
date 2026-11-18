import { test, expect } from '../fixtures/test';
import { PRODUCTS } from '../data/catalog';

const { diorSauvage, primalElement, tangleTeezer } = PRODUCTS;

test.describe('Cart', () => {
  test('TC-CART-01 Empty cart shows empty state and "go shopping" button', async ({ page, cartPage }) => {
    await cartPage.open();

    await expect(cartPage.emptyState).toBeVisible();
    await cartPage.goShoppingButton.click();
    await expect(page).toHaveURL(/#\/$/);
  });

  test('TC-CART-02 Add product from category page: toast + badge + item in cart', { tag: ['@smoke', '@mobile'] }, async ({
    categoryPage,
    cartPage,
  }) => {
    await categoryPage.openCategory(diorSauvage.category);
    await categoryPage.product(diorSauvage.title).addToCart();

    await categoryPage.expectToast(`"${diorSauvage.title}" додано до кошика!`);
    await categoryPage.expectCartBadge(1);

    await categoryPage.goToCart();
    const item = cartPage.item(diorSauvage.title);
    await expect(item.root).toBeVisible();
    await expect(item.price).toHaveText(`${diorSauvage.price} ₴`);
    await expect(item.quantity).toHaveText('1');
    await cartPage.expectTotal(diorSauvage.price);
  });

  test('TC-CART-03 Add product from product page', async ({ productPage, cartPage }) => {
    await productPage.openProduct(tangleTeezer.id);
    await productPage.addToCart();
    await productPage.expectCartBadge(1);

    await productPage.goToCart();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(tangleTeezer.title).root).toBeVisible();
  });

  test('TC-CART-04 Adding the same product twice increases quantity (no duplicate row)', async ({
    categoryPage,
    cartPage,
  }) => {
    await categoryPage.openCategory(diorSauvage.category);
    const card = categoryPage.product(diorSauvage.title);
    await card.addToCart();
    await card.addToCart();
    await categoryPage.expectCartBadge(2);

    await categoryPage.goToCart();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(diorSauvage.title).quantity).toHaveText('2');
    await cartPage.expectTotal(diorSauvage.price * 2);
  });

  test('TC-CART-05 Increase / decrease quantity recalculates total', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory(primalElement.category);
    await categoryPage.product(primalElement.title).addToCart();
    await cartPage.open();

    const item = cartPage.item(primalElement.title);
    await item.increaseButton.click();
    await item.increaseButton.click();
    await expect(item.quantity).toHaveText('3');
    await cartPage.expectTotal(primalElement.price * 3);
    await cartPage.expectCartBadge(3);

    await item.decreaseButton.click();
    await expect(item.quantity).toHaveText('2');
    await cartPage.expectTotal(primalElement.price * 2);
  });

  test('TC-CART-06 Quantity cannot go below 1 (minus button is disabled)', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory(primalElement.category);
    await categoryPage.product(primalElement.title).addToCart();
    await cartPage.open();

    const item = cartPage.item(primalElement.title);
    await expect(item.quantity).toHaveText('1');
    await expect(item.decreaseButton).toBeDisabled();
  });

  test('TC-CART-07 Total is the sum of all products × quantity', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await categoryPage.product(primalElement.title).addToCart();
    await categoryPage.product(primalElement.title).addToCart();

    await cartPage.open();
    await expect(cartPage.items).toHaveCount(2);
    await cartPage.expectTotal(diorSauvage.price + primalElement.price * 2);
  });

  test('TC-CART-08 Remove one product from the cart', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await categoryPage.product(primalElement.title).addToCart();
    await cartPage.open();

    await cartPage.item(diorSauvage.title).removeButton.click();

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.item(diorSauvage.title).root).toHaveCount(0);
    await cartPage.expectTotal(primalElement.price);
  });

  test('TC-CART-09 Removing the last product shows the empty state', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await cartPage.open();

    await cartPage.item(diorSauvage.title).removeButton.click();
    await expect(cartPage.emptyState).toBeVisible();
    await cartPage.expectCartBadge(0);
  });

  test('TC-CART-10 Clear cart → cancel in the modal keeps the products', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await cartPage.open();

    await cartPage.clearCartButton.click();
    await expect(cartPage.modal.title).toHaveText('Очистити кошик?');
    await cartPage.modal.cancel();

    await expect(cartPage.items).toHaveCount(1);
  });

  test('TC-CART-11 Clear cart → confirm removes all products', async ({ categoryPage, cartPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await categoryPage.product(primalElement.title).addToCart();
    await cartPage.open();

    await cartPage.clearCartButton.click();
    await cartPage.modal.confirm();

    await expect(cartPage.emptyState).toBeVisible();
    await cartPage.expectCartBadge(0);
  });

  test('TC-CART-12 Cart is saved after page reload (localStorage)', async ({ page, categoryPage, cartPage }) => {
    await categoryPage.openCategory('men');
    await categoryPage.product(diorSauvage.title).addToCart();
    await categoryPage.product(diorSauvage.title).addToCart();

    await page.reload();
    await cartPage.waitForAppReady();
    await cartPage.expectCartBadge(2);

    await cartPage.goToCart();
    await expect(cartPage.item(diorSauvage.title).quantity).toHaveText('2');
  });
});
