export interface ProductVariant {
  id?: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  basePrice: number;
  variants: ProductVariant[];
  isAvailable: boolean;
  isBestSeller: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

export type PaymentMethod = 'TRANSFER' | 'COD';
export type PaymentStatus = 'BELUM_DIBAYAR' | 'MENUNGGU_VERIFIKASI' | 'PEMBAYARAN_DIKONFIRMASI';
export type OrderStatus =
  | 'MENUNGGU_KONFIRMASI'
  | 'PEMBAYARAN_MENUNGGU'
  | 'PEMBAYARAN_DIKONFIRMASI'
  | 'DIPROSES'
  | 'SIAP_DIKIRIM'
  | 'DIKIRIM'
  | 'SELESAI'
  | 'DIBATALKAN';

export interface CartItem {
  id: string; // unique ID for cart item (product.id + variant.name)
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  price: number;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  proofOfPaymentUrl?: string;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  productId: string;
  normalPrice: number;
  promoPrice: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  description: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  googleMapsUrl: string;
  shippingFee?: number;
}

export interface DashboardStats {
  todayOrdersCount: number;
  newOrdersCount: number;
  processingOrdersCount: number;
  completedOrdersCount: number;
  totalRevenue: number;
  totalProductsCount: number;
  topProductNames: { name: string; sales: number }[];
  dailySales: { date: string; amount: number }[];
}
