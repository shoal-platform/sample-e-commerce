export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[]; // parsed from JSON
  categoryId: string;
  category?: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  sizes?: string[] | null; // parsed from JSON
  colors?: string[] | null; // parsed from JSON
  brand?: string | null;
  sku?: string | null;
  weight?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRaw {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string; // JSON string
  categoryId: string;
  category?: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  sizes?: string | null; // JSON string
  colors?: string | null; // JSON string
  brand?: string | null;
  sku?: string | null;
  weight?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone?: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  user?: {
    name?: string | null;
    image?: string | null;
  };
  productId: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  stripePaymentId?: string | null;
  stripeSessionId?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  shippingName?: string | null;
  shippingEmail?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingZip?: string | null;
  shippingCountry?: string | null;
  items?: OrderItem[];
  user?: {
    name?: string | null;
    email: string;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
  featured?: boolean;
}

export type ProductSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: string;
}

export interface CheckoutFormData {
  // Shipping
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  // Payment
  saveAddress?: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    totalSold: number;
  }>;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}
