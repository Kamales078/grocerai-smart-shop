export type UserRole = 'customer' | 'store_owner' | 'delivery' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  unit: string;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isOrganic?: boolean;
  storeId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  estimatedPrice: number;
  checked: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  address: string;
  deliveryPersonId?: string;
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  rating: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  activeUsers: number;
  avgOrderValue: number;
  salesTrends: { day: string; sales: number }[];
  fraudAlerts: { orderId: string; message: string; severity: 'low' | 'medium' | 'high' }[];
}
