import { expect, type Locator, type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly accountLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly categoryNav: Locator;
  readonly toasts: Locator;
  readonly modal: ConfirmModal;
  readonly main: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.logo = this.header.getByRole('link', { name: 'Make-Up' });
    this.searchInput = this.header.getByRole('searchbox', { name: 'Search' });
    this.accountLink = this.header.locator('a[href="#/auth"]');
    this.cartLink = this.header.locator('a[href="#/cart"]');
    this.cartBadge = this.cartLink.locator('.badge');
    this.categoryNav = this.header.locator('ul.nav');
    this.toasts = page.locator('.toaster .toast-text');
    this.modal = new ConfirmModal(page);
    this.main = page.locator('main');
  }

  async open(route = '/') {
    await this.page.goto(`/#${route}`);
    await this.waitForAppReady();
  }

  async waitForAppReady() {
    await expect(this.header).toBeVisible({ timeout: 10_000 });
  }

  async goToCategory(name: string) {
    await this.categoryNav.getByRole('link', { name, exact: true }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async goToAccount() {
    await this.accountLink.click();
  }

  async expectToast(text: string | RegExp) {
    await expect(this.toasts.filter({ hasText: text }).first()).toBeVisible();
  }

  async expectCartBadge(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}

export class ConfirmModal {
  readonly root: Locator;
  readonly title: Locator;
  readonly message: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('.modal-content-custom');
    this.title = this.root.locator('h4');
    this.message = this.root.locator('.modal-body-custom p');
    this.confirmButton = this.root.locator('.modal-footer-custom .site-button');
    this.cancelButton = this.root.locator('.modal-footer-custom .btn-link');
    this.closeButton = this.root.locator('.btn-close-custom');
  }

  async confirm() {
    await this.confirmButton.click();
    await expect(this.root).toBeHidden();
  }

  async cancel() {
    await this.cancelButton.click();
    await expect(this.root).toBeHidden();
  }
}
