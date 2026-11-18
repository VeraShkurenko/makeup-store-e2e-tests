import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { TestUser } from '../data/users';

export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;

  readonly accountHeading: Locator;
  readonly accountName: Locator;
  readonly accountEmail: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.main.getByRole('heading', { name: 'Вхід до кабінету' });
    this.emailInput = this.main.getByPlaceholder('Електронна пошта', { exact: true });
    this.passwordInput = this.main.getByPlaceholder('Пароль', { exact: true });
    this.loginButton = this.main.getByRole('button', { name: 'Увійти' });
    this.registerLink = this.main.getByRole('link', { name: 'Створити акаунт' });

    this.accountHeading = this.main.getByRole('heading', { name: 'Мій кабінет' });
    this.accountName = this.main.locator('h4');
    this.accountEmail = this.main.locator('.card p.text-muted');
    this.logoutButton = this.main.getByRole('button', { name: 'Вийти з кабінету' });
  }

  async open() {
    await super.open('/auth');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

export class RegisterPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly cityInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.main.getByRole('heading', { name: 'Реєстрація' });
    this.nameInput = this.main.getByPlaceholder("Ваше ім'я *");
    this.emailInput = this.main.getByPlaceholder('Електронна пошта *');
    this.phoneInput = this.main.getByPlaceholder('Номер телефону');
    this.cityInput = this.main.getByPlaceholder('Місто');
    this.passwordInput = this.main.getByPlaceholder('Пароль *');
    this.submitButton = this.main.getByRole('button', { name: 'Зареєструватися' });
  }

  async open() {
    await super.open('/register');
  }

  async register(user: Partial<TestUser>) {
    if (user.name !== undefined) await this.nameInput.fill(user.name);
    if (user.email !== undefined) await this.emailInput.fill(user.email);
    if (user.phone !== undefined) await this.phoneInput.fill(user.phone);
    if (user.city !== undefined) await this.cityInput.fill(user.city);
    if (user.password !== undefined) await this.passwordInput.fill(user.password);
    await this.submitButton.click();
  }
}
