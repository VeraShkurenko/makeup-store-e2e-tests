import { test, expect } from '../fixtures/test';
import { CATEGORIES, PRODUCTS, NON_EXISTENT_CATEGORY, NON_EXISTENT_PRODUCT_ID } from '../data/catalog';

test.describe('Catalog: categories', () => {
  for (const category of CATEGORIES) {
    test(`TC-CAT-01 Category "${category.name}" opens from the menu and shows ${category.productCount} products`, async ({
      page,
      homePage,
      categoryPage,
    }) => {
      await homePage.open();
      await homePage.goToCategory(category.name);

      await expect(page).toHaveURL(new RegExp(`#/section/${category.slug}$`));
      await expect(categoryPage.heading).toHaveText(category.title);
      await expect(categoryPage.productCards).toHaveCount(category.productCount);
      await expect(categoryPage.productCounter).toHaveText(`${category.productCount} товарів`);
    });
  }

  test('TC-CAT-02 Breadcrumbs show the category and lead back to home', async ({ page, categoryPage }) => {
    await categoryPage.openCategory('hair');

    await expect(categoryPage.breadcrumbs).toContainText('Головна');
    await expect(categoryPage.breadcrumbs).toContainText('Волосся');

    await categoryPage.breadcrumbs.getByRole('link', { name: 'Головна' }).click();
    await expect(page).toHaveURL(/#\/$/);
  });

  test('TC-CAT-03 Every product card has title, type, price and "add to cart" button', async ({ categoryPage }) => {
    await categoryPage.openCategory('accessories');
    const count = await categoryPage.productCards.count();

    for (let i = 0; i < count; i++) {
      const card = categoryPage.productCards.nth(i);
      await expect(card.locator('h6')).not.toBeEmpty();
      await expect(card.locator('p.text-muted')).not.toBeEmpty();
      await expect(card.locator('span.text-danger')).toHaveText(/^\d+ ₴$/);
      await card.hover();
      await expect(card.getByRole('button', { name: 'ДОДАТИ У КОШИК' })).toBeEnabled();
    }
  });

  test('TC-CAT-04 "Акції" shows only discounted products (with old price)', async ({ page, homePage, categoryPage }) => {
    await homePage.open();
    await homePage.categoryNav.getByRole('link', { name: 'Акції' }).click();

    await expect(page).toHaveURL(/#\/section\/sales$/);
    await expect(categoryPage.heading).toHaveText('Акційні пропозиції');
    await expect(categoryPage.productCards.first()).toBeVisible();

    const titles = await categoryPage.productCards.locator('h6').allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles).toContain(PRODUCTS.volumeShampoo.title);
  });

  test('TC-CAT-05 Unknown category shows "not found" message', async ({ categoryPage }) => {
    await categoryPage.openCategory(NON_EXISTENT_CATEGORY);
    await expect(categoryPage.notFoundMessage).toBeVisible();
    await expect(categoryPage.main.getByRole('link', { name: 'Повернутися на головну' })).toBeVisible();
  });
});

test.describe('Catalog: product page', () => {
  test('TC-PRD-01 Product card opens the product page with correct details', { tag: '@smoke' }, async ({
    page,
    categoryPage,
    productPage,
  }) => {
    const product = PRODUCTS.diorSauvage;
    await categoryPage.openCategory(product.category);
    await categoryPage.product(product.title).open();

    await expect(page).toHaveURL(new RegExp(`#/product/${product.id}$`));
    await productPage.expectProduct(product);
    await expect(productPage.breadcrumbs).toContainText(product.title);
    await expect(productPage.main.getByText('Є в наявності')).toBeVisible();
  });

  test('TC-PRD-02 Discounted product shows both new and old (crossed-out) price', async ({ productPage }) => {
    const product = PRODUCTS.volumeShampoo;
    await productPage.openProduct(product.id);

    await expect(productPage.price).toHaveText(`${product.price} ₴`);
    await expect(productPage.oldPrice).toHaveText(`${product.oldPrice} ₴`);
    await expect(productPage.oldPrice).toHaveCSS('text-decoration-line', 'line-through');
  });

  test('TC-PRD-03 Product without discount has no old price', async ({ productPage }) => {
    await productPage.openProduct(PRODUCTS.rayBan.id);
    await expect(productPage.title).toHaveText(PRODUCTS.rayBan.title);
    await expect(productPage.oldPrice).toHaveCount(0);
  });

  test('TC-PRD-04 Unknown product ID shows "not found" message', async ({ productPage }) => {
    await productPage.openProduct(NON_EXISTENT_PRODUCT_ID);
    await expect(productPage.notFoundMessage).toBeVisible();
    await expect(productPage.main).toContainText(String(NON_EXISTENT_PRODUCT_ID));
  });
});
