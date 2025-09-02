import { Product, Order, Staff, SalesData, SystemSettings, ProductCategory } from './types';

const STORAGE_KEYS = {
  PRODUCTS: 'fusion-eats-products',
  ORDERS: 'fusion-eats-orders',
  HELD_ORDERS: 'fusion-eats-held-orders',
  STAFF: 'fusion-eats-staff',
  SALES_DATA: 'fusion-eats-sales',
  SETTINGS: 'fusion-eats-settings',
  CURRENT_ORDER: 'fusion-eats-current-order',
} as const;

// Initialize default data
const defaultProducts: Record<ProductCategory, Product[]> = {
  pizzas: [
    { 
      id: 1, 
      name: 'Margherita', 
      price: 8.99, 
      description: 'Classic cheese and tomato pizza with fresh basil on a wooden table in a bright Italian kitchen', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e40d9270-c0ad-4b1b-9531-57d22f8d0e1f.png', 
      category: 'pizzas' 
    },
    { 
      id: 2, 
      name: 'Pepperoni', 
      price: 10.99, 
      description: 'Spicy pepperoni with mozzarella and tomato sauce topped with hot peppers on a red checkered table', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/28b9d99e-03bc-49a7-9b53-f1e9747749a0.png', 
      category: 'pizzas' 
    },
    { 
      id: 3, 
      name: 'Quattro Stagioni', 
      price: 12.99, 
      description: 'Four seasons pizza with artichokes, mushrooms, ham, and olives', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9f5f9e2d-b367-4b92-a020-bb50e40e5b90.png', 
      category: 'pizzas' 
    },
  ],
  traditional: [
    { 
      id: 4, 
      name: 'Fish & Chips', 
      price: 12.99, 
      description: 'Golden battered cod with chips and mushy peas in a takeaway container', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9f04079d-4613-4a45-8b8e-c98b0c871f5a.png', 
      category: 'traditional' 
    },
    { 
      id: 5, 
      name: 'Bangers & Mash', 
      price: 9.99, 
      description: 'Traditional sausages with creamy mashed potatoes and gravy', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3d343fc8-fe58-4fa9-86d4-3bf194871e04.png', 
      category: 'traditional' 
    },
  ],
  chippy: [
    { 
      id: 6, 
      name: 'Chicken Nuggets', 
      price: 5.99, 
      description: 'Crispy chicken nuggets with dipping sauce', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e180b03b-180c-471b-a59f-1e7857a079a7.png', 
      category: 'chippy' 
    },
    { 
      id: 7, 
      name: 'Battered Sausage', 
      price: 3.99, 
      description: 'Traditional battered sausage with chips', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c1e179d6-5f2b-451d-a3ad-8c493d0caf30.png', 
      category: 'chippy' 
    },
  ],
  specials: [
    { 
      id: 8, 
      name: 'Veggie Delight', 
      price: 9.99, 
      description: 'Assorted vegetables with cheese and tomato base', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3edcd9cc-3460-4dc1-8dc7-c5074043527b.png', 
      category: 'specials' 
    },
    { 
      id: 9, 
      name: 'BBQ Feast', 
      price: 14.99, 
      description: 'BBQ chicken, bacon, and peppers with BBQ sauce', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/59e2dcd9-5c1f-4ec6-8de4-6adb1868a238.png', 
      category: 'specials' 
    },
  ],
  'gluten-free': [
    { 
      id: 10, 
      name: 'Gluten-Free Pizza', 
      price: 11.99, 
      description: 'Special gluten-free crust with toppings in a cozy dining room', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1d7c2932-641b-4cb9-97d1-d0ce635bcfb4.png', 
      category: 'gluten-free' 
    },
  ],
  kids: [
    { 
      id: 11, 
      name: 'Kids Burger', 
      price: 4.99, 
      description: 'Mini burger with fries and toy on a colorful plate for kids', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/978e9530-b124-429b-acd4-7bfcff569a0c.png', 
      category: 'kids' 
    },
    { 
      id: 12, 
      name: 'Mini Pizza', 
      price: 5.99, 
      description: 'Child-sized pizza with simple toppings', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3f1e04e0-3e83-4e6c-9a92-c9ed1372df05.png', 
      category: 'kids' 
    },
  ],
  sides: [
    { 
      id: 13, 
      name: 'Garlic Bread', 
      price: 3.99, 
      description: 'Buttery garlic breadsticks in a woven basket', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ba32cb04-136b-4cb5-96c9-6ebae048440b.png', 
      category: 'sides' 
    },
    { 
      id: 14, 
      name: 'Onion Rings', 
      price: 3.49, 
      description: 'Crispy golden onion rings with dipping sauce', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d06e1ad9-95cb-4d31-899f-53979fd4a08a.png', 
      category: 'sides' 
    },
  ],
  drinks: [
    { 
      id: 15, 
      name: 'Cola', 
      price: 1.50, 
      description: 'Refreshing cola drink in a glass bottle with condensation dripping down', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0b070307-4e3d-494e-bea3-7c1625fcedb6.png', 
      category: 'drinks' 
    },
    { 
      id: 16, 
      name: 'Orange Juice', 
      price: 2.00, 
      description: 'Fresh squeezed orange juice in a tall glass', 
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ce2b701f-7cca-4058-95a0-dfcd6dfb497e.png', 
      category: 'drinks' 
    },
  ],
};

const defaultSettings: SystemSettings = {
  staffPassword: 'staff123',
  adminPassword: 'admin123',
};

const defaultSalesData: SalesData = {
  dailySales: 0,
  cumulativeSales: 0,
  transactions: [],
};

// Storage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// Specific storage functions
export const getProducts = (): Record<ProductCategory, Product[]> => {
  return storage.get(STORAGE_KEYS.PRODUCTS, defaultProducts);
};

export const setProducts = (products: Record<ProductCategory, Product[]>): void => {
  storage.set(STORAGE_KEYS.PRODUCTS, products);
};

export const getHeldOrders = (): Order[] => {
  return storage.get(STORAGE_KEYS.HELD_ORDERS, []);
};

export const setHeldOrders = (orders: Order[]): void => {
  storage.set(STORAGE_KEYS.HELD_ORDERS, orders);
};

export const getStaff = (): Staff[] => {
  return storage.get(STORAGE_KEYS.STAFF, []);
};

export const setStaff = (staff: Staff[]): void => {
  storage.set(STORAGE_KEYS.STAFF, staff);
};

export const getSalesData = (): SalesData => {
  return storage.get(STORAGE_KEYS.SALES_DATA, defaultSalesData);
};

export const setSalesData = (salesData: SalesData): void => {
  storage.set(STORAGE_KEYS.SALES_DATA, salesData);
};

export const getSettings = (): SystemSettings => {
  return storage.get(STORAGE_KEYS.SETTINGS, defaultSettings);
};

export const setSettings = (settings: SystemSettings): void => {
  storage.set(STORAGE_KEYS.SETTINGS, settings);
};

export const getCurrentOrder = (): Order | null => {
  return storage.get(STORAGE_KEYS.CURRENT_ORDER, null);
};

export const setCurrentOrder = (order: Order | null): void => {
  if (order) {
    storage.set(STORAGE_KEYS.CURRENT_ORDER, order);
  } else {
    storage.remove(STORAGE_KEYS.CURRENT_ORDER);
  }
};

// Initialize default data if not exists
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setProducts(defaultProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setSettings(defaultSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES_DATA)) {
    setSalesData(defaultSalesData);
  }
};