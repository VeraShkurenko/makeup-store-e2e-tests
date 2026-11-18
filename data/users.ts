export interface TestUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
}

export const ADMIN: TestUser = {
  name: 'Адміністратор',
  email: 'admin@makeup.com',
  password: '123',
};

export function newUser(overrides: Partial<TestUser> = {}): TestUser {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: 'Тестова Користувачка',
    email: `qa.user.${id}@example.com`,
    password: 'Test#12345',
    phone: '+380501234567',
    city: 'Одеса',
    ...overrides,
  };
}
