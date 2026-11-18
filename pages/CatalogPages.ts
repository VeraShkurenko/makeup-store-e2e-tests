import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductCard {
  readonly root: Locator;
  readonly title: Locator;
  readonly type: Locator;
  readonly price: Locator;
  readonly label: Locator;
  readonly imageLink: Locator;
  readonly addToCartButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = root.locator('h6');
    this.type = root.locator('p.text-muted');
    this.price = root.locator('span.text-danger');
    this.label = root.locator('.position-absolute');
    this.imageLink = root.locator('a').first();
    this.addToCartButton = root.getByRole('button', { name: 'ДОДАТИ У КОШИК' });
  }

  async addToCart() {
    await this.root.hover();
    await this.addToCartButton.click();
  }

  async open() {
    await this.imageLink.click();
  }
}

export class HomePage extends BasePage {
  readonly carousel: Locator;
  readonly sectionHeadings: Locator;

  constructor(page: Page) {
    super(page);
    this.carousel = page.locator('#carouselExample');
    this.sectionHeadings = this.main.locator('h2');
  }

  async open() {
    await super.open('/');
  }
}

export class CategoryPage extends BasePage {
  readonly heading: Locator;
  readonly productCounter: Locator;
  readonly breadcrumbs: Locator;
  readonly productCards: Locator;
  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.main.locator('div:has(> nav[aria-label="breadcrumb"]) h2');
    this.productCounter = this.main.getByText(/\d+ товарів/);
    this.breadcrumbs = this.main.locator('.breadcrumb');
    this.productCards = this.main.locator('.product-card');
    this.notFoundMessage = this.main.getByRole('heading', { name: 'Категорію не знайдено' });
  }

  async openCategory(slug: string) {
    await super.open(`/section/${slug}`);
  }

  product(title: string): ProductCard {
    return new ProductCard(
      this.productCards.filter({
        has: this.page.locator('h6', { hasText: new RegExp(`^${escapeRegExp(title)}$`) }),
      }),
    );
  }
}

export class ProductPage extends BasePage {
  readonly title: Locator;
  readonly type: Locator;
  readonly price: Locator;
  readonly oldPrice: Locator;
  readonly sku: Locator;
  readonly addToCartButton: Locator;
  readonly breadcrumbs: Locator;
  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.title = this.main.locator('h1');
    this.type = this.main.locator('.col-md-6 p.text-uppercase');
    this.price = this.main.locator('.display-6');
    this.oldPrice = this.main.locator('.text-decoration-line-through');
    this.sku = this.main.locator('p', { hasText: 'Артикул:' });
    this.addToCartButton = this.main.getByRole('button', { name: 'Додати у кошик' });
    this.breadcrumbs = this.main.locator('.breadcrumb');
    this.notFoundMessage = this.main.getByRole('heading', { name: 'Товар не знайдено' });
  }

  async openProduct(id: number | string) {
    await super.open(`/product/${id}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async expectProduct(p: { title: string; type: string; price: number; id: number }) {
    await expect(this.title).toHaveText(p.title);
    await expect(this.type).toHaveText(p.type);
    await expect(this.price).toHaveText(`${p.price} ₴`);
    await expect(this.sku).toContainText(String(1000 + p.id));
  }
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
