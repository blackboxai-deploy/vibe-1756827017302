// Core data types for the EPOS system
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  id: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
  status: 'current' | 'held' | 'completed';
  paymentMethod?: 'cash' | 'card';
}

export interface Staff {
  id: number;
  name: string;
  role: string;
}

export interface SalesData {
  dailySales: number;
  cumulativeSales: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  paymentMethod: 'cash' | 'card';
  timestamp: Date;
  items: OrderItem[];
}

export interface SystemSettings {
  staffPassword: string;
  adminPassword: string;
}

export type ProductCategory = 
  | 'pizzas' 
  | 'traditional' 
  | 'chippy' 
  | 'specials' 
  | 'gluten-free' 
  | 'kids' 
  | 'sides' 
  | 'drinks';

export interface AuthState {
  isAuthenticated: boolean;
  userType: 'staff' | 'admin' | null;
}

export interface POSState {
  currentOrder: Order;
  heldOrders: Order[];
  activeCategory: ProductCategory;
  products: Record<ProductCategory, Product[]>;
  staff: Staff[];
  salesData: SalesData;
  settings: SystemSettings;
}