export interface Category {
  name: string;
  slug: string;
  title: string;
  productCount: number;
}

export const CATEGORIES: Category[] = [
  { name: 'Парфумерія', slug: 'parfumes', title: 'Парфумерія', productCount: 6 },
  { name: 'Макіяж', slug: 'makeup', title: 'Макіяж', productCount: 4 },
  { name: 'Обличчя', slug: 'face', title: 'Обличчя', productCount: 6 },
  { name: 'Волосся', slug: 'hair', title: 'Волосся', productCount: 4 },
  { name: 'Тіло', slug: 'body', title: 'Тіло', productCount: 4 },
  { name: "Здоров'я", slug: 'health', title: "Здоров'я", productCount: 6 },
  { name: 'Аксесуари', slug: 'accessories', title: 'Аксесуари', productCount: 4 },
  { name: 'Fashion', slug: 'fashion', title: 'Fashion', productCount: 4 },
  { name: 'Чоловікам', slug: 'men', title: 'Чоловікам', productCount: 5 },
];

export interface Product {
  id: number;
  title: string;
  type: string;
  price: number;
  oldPrice?: number;
  category: string;
}

export const PRODUCTS = {
  diorSauvage: { id: 41, title: 'Dior Sauvage', type: 'Гель після гоління', price: 2100, category: 'men' },
  primalElement: { id: 42, title: 'Primal Element', type: 'Мило ручної роботи', price: 320, category: 'men' },
  volumeShampoo: {
    id: 45,
    title: 'Шампунь для об’єму',
    type: 'Hair Care',
    price: 450,
    oldPrice: 600,
    category: 'men',
  },
  tangleTeezer: { id: 33, title: 'Tangle Teezer Original', type: 'Щітка для волосся', price: 450, category: 'accessories' },
  rayBan: { id: 40, title: 'Ray-Ban Aviator', type: 'Сонцезахисні окуляри', price: 4600, category: 'fashion' },
} satisfies Record<string, Product>;

export const NON_EXISTENT_PRODUCT_ID = 99999;
export const NON_EXISTENT_CATEGORY = 'no-such-category';
