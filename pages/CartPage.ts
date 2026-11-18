import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartItem {
  readonly root: Locator;
  readonly title: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly increaseButton: Locator;
  readonly decreaseButton: Locator;
  readonly removeButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = root.locator('h6');
    this.price = root.locator('span.h5');
    this.quantity = root.locator('.border-dark span');
    this.increaseButton = root.getByRole('button', { name: '+' });
    this.decreaseButton = root.getByRole('button', { name: '—' });
    this.removeButton = root.getByTitle('Видалити');
  }
}

export class CartPage extends BasePage {
  readonly heading: Locator;
  readonly items: Locator;
  readonly clearCartButton: Locator;
  readonly checkoutButton: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly emptyState: Locator;
  readonly goShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.main.getByRole('heading', { level: 2 });
    this.items = this.main.locator('.col-md-8 > div:has(h6)');
    this.clearCartButton = this.main.getByRole('button', { name: /Очистити кошик/ });
    this.checkoutButton = this.main.getByRole('button', { name: 'Оформити замовлення' });
    this.subtotal = this.main.locator('.col-md-4 .fw-bold').filter({ hasText: '₴' }).first();
    this.total = this.main.locator('.col-md-4 .h4');
    this.emptyState = this.main.getByRole('heading', { name: 'Ваш кошик порожній' });
    this.goShoppingButton = this.main.getByRole('button', { name: 'Перейти до покупок' });
  }

  async open() {
    await super.open('/cart');
  }

  item(title: string): CartItem {
    return new CartItem(this.items.filter({ has: this.page.locator('h6', { hasText: title }) }));
  }

  async expectTotal(amount: number) {
    await expect(this.total).toHaveText(`${amount} ₴`);
  }

  async checkout() {
    await this.checkoutButton.click();
    await expect(this.modal.root).toBeVisible();
    await this.modal.confirm();
  }
}

export class ThankYouPage extends BasePage {
  readonly heading: Locator;
  readonly orderNumber: Locator;
  readonly homeButton: Locator;
  readonly recommendations: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.main.getByRole('heading', { name: 'Дякуємо за замовлення!' });
    this.orderNumber = this.main.locator('p.lead span.fw-bold');
    this.homeButton = this.main.getByRole('button', { name: 'На головну' });
    this.recommendations = this.main.locator('.product-card');
  }
}
