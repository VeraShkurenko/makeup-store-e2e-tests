import { test as base } from '@playwright/test';
import { HomePage, CategoryPage, ProductPage } from '../pages/CatalogPages';
import { CartPage, ThankYouPage } from '../pages/CartPage';
import { LoginPage, RegisterPage } from '../pages/AuthPages';

type Pages = {
  homePage: HomePage;
  categoryPage: CategoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  thankYouPage: ThankYouPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  thankYouPage: async ({ page }, use) => use(new ThankYouPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
});

export { expect } from '@playwright/test';
