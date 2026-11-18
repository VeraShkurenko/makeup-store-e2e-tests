import { test, expect } from '../fixtures/test';
import { ADMIN, newUser } from '../data/users';

test.describe('Authorization: login', () => {
  test('TC-AUTH-01 Login with valid credentials', { tag: ['@smoke', '@mobile'] }, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(ADMIN.email, ADMIN.password);

    await loginPage.expectToast(`Вітаємо, ${ADMIN.name}!`);
    await expect(page).toHaveURL(/#\/home$/);
  });

  test('TC-AUTH-02 Logged-in user sees "My account" with name and email', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(ADMIN.email, ADMIN.password);
    await loginPage.goToAccount();

    await expect(loginPage.accountHeading).toBeVisible();
    await expect(loginPage.accountName).toHaveText(ADMIN.name);
    await expect(loginPage.accountEmail).toHaveText(ADMIN.email);
  });

  test('TC-AUTH-03 Login with wrong password shows an error', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(ADMIN.email, 'wrong-password');

    await loginPage.expectToast('Невірний email або пароль');
    await expect(page).toHaveURL(/#\/auth$/);
    await expect(loginPage.heading).toBeVisible();
  });

  test('TC-AUTH-04 Login with non-registered email shows an error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('nobody@example.com', ADMIN.password);
    await loginPage.expectToast('Невірний email або пароль');
  });

  const emptyCases = [
    { name: 'both fields empty', email: '', password: '' },
    { name: 'empty password', email: ADMIN.email, password: '' },
    { name: 'empty email', email: '', password: ADMIN.password },
  ];
  for (const c of emptyCases) {
    test(`TC-AUTH-05 Validation: ${c.name}`, async ({ page, loginPage }) => {
      await loginPage.open();
      await loginPage.login(c.email, c.password);

      await loginPage.expectToast('Будь ласка, введіть email та пароль');
      await expect(page).toHaveURL(/#\/auth$/);
    });
  }

  test('TC-AUTH-06 Email is case-sensitive? Login with UPPERCASE email', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(ADMIN.email.toUpperCase(), ADMIN.password);
    await loginPage.expectToast('Невірний email або пароль');
  });

  test('TC-AUTH-07 Logout returns the login form', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(ADMIN.email, ADMIN.password);
    await loginPage.goToAccount();

    await loginPage.logoutButton.click();
    await loginPage.expectToast('Ви вийшли з акаунта');
    await expect(loginPage.heading).toBeVisible();
  });

  test('TC-AUTH-08 Session is kept after page reload', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(ADMIN.email, ADMIN.password);
    await page.reload();
    await loginPage.waitForAppReady();

    await expect(loginPage.accountLink).toContainText(ADMIN.name);
  });
});

test.describe('Authorization: registration', () => {
  test('TC-REG-01 Register a new user and log in with it', { tag: '@smoke' }, async ({
    page,
    registerPage,
    loginPage,
  }) => {
    const user = newUser();
    await registerPage.open();
    await registerPage.register(user);

    await registerPage.expectToast('Реєстрація успішна! Тепер увійдіть.');
    await expect(page).toHaveURL(/#\/auth$/);

    await loginPage.login(user.email, user.password);
    await loginPage.goToAccount();
    await expect(loginPage.accountName).toHaveText(user.name);
    await expect(loginPage.main).toContainText(user.phone!);
    await expect(loginPage.main).toContainText(user.city!);
  });

  test('TC-REG-02 Optional fields (phone, city) can be empty', async ({ registerPage, loginPage }) => {
    const user = newUser({ phone: undefined, city: undefined });
    await registerPage.open();
    await registerPage.register(user);
    await registerPage.expectToast('Реєстрація успішна! Тепер увійдіть.');

    await loginPage.login(user.email, user.password);
    await loginPage.goToAccount();
    await expect(loginPage.main.getByText('Не вказано')).toHaveCount(2);
  });

  const requiredFields = ['name', 'email', 'password'] as const;
  for (const field of requiredFields) {
    test(`TC-REG-03 Required field "${field}" cannot be empty`, async ({ page, registerPage }) => {
      const user = newUser();
      await registerPage.open();
      await registerPage.register({ ...user, [field]: '' });

      await registerPage.expectToast("Будь ласка, заповніть обов'язкові поля (Ім'я, Email, Пароль)");
      await expect(page).toHaveURL(/#\/register$/);
    });
  }

  test('TC-REG-04 Registration with an existing email is rejected', async ({ registerPage }) => {
    await registerPage.open();
    await registerPage.register(newUser({ email: ADMIN.email }));
    await registerPage.expectToast('Користувач з таким email вже існує');
  });

  test('TC-REG-05 "Створити акаунт" link opens the registration form', async ({ page, loginPage, registerPage }) => {
    await loginPage.open();
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/#\/register$/);
    await expect(registerPage.heading).toBeVisible();
  });
});
