export type UserRole = 'client' | 'librairie' | 'admin';


export type LibraryDocumentType =
  | 'rccm'
  | 'taxpayer_card'
  | 'creation_certificate'
  | 'manager_id'
  | 'location_plan'
  | 'address_proof'
  | 'tax_certificate';

export interface UploadedDocument {
  id: string;
  type: LibraryDocumentType;
  label: string;
  fileName: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  required: boolean;
  uploadedAt: string;
}

export type Currency = 'XAF' | 'EUR' | 'USD';

export type Language = 'fr' | 'en';

export type ProductType = 'sale' | 'rental' | 'both';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  type?: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  country?: string;
  location?: string;
  language?: Language;
  currency?: Currency;
  favorites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface Librairie {
  id: string;
  userId: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  coverImage?: string;
  location: Location;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  website?: string;
  openingHours?: string;
  rating: number;
  reviewsCount: number;
  productsCount: number;
  verified: boolean;
  active: boolean;
  ownerName?: string;
  rccmNumber?: string;
  taxpayerNumber?: string;
  legalStatus?: string;
  validationStatus?: 'pending' | 'approved' | 'rejected';
  validationDocuments?: UploadedDocument[];
  source?: string;
  googleMapsQuery?: string;
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string | {
    fr: string;
    en: string;
  };
  slug?: string;
  description?: string | {
    fr: string;
    en: string;
  };
  icon?: string;
  parentId?: string;
  order?: number;
  active?: boolean;
}

export interface Product {
  id: string;
  librarieId: string;
  title: string;
  description: string;
  categoryId: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  images: string[];
  type: ProductType;
  salePrice?: number;
  purchasePrice?: number;
  rentalPricePerDay?: number;
  digitalPrice?: number;
  pdfUrl?: string;
  stock: number;
  available?: boolean;
  condition?: 'new' | 'like-new' | 'good' | 'acceptable' | 'Neuf' | string;
  rating: number;
  reviewsCount: number;
  tags?: string[];
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  publicationYear?: number;
  language?: string;
  pages?: number;
}

export interface CartItem {
  productId: string;
  type: 'sale' | 'rental' | 'digital';
  quantity: number;
  rentalDays?: number;
}

export interface Order {
  id: string;
  userId: string;
  librarieId: string;
  items: {
    productId: string;
    title: string;
    image?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  currency: Currency;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress: {
    name: string;
    phone?: string;
    address: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
}

export interface Rental {
  id: string;
  userId: string;
  librarieId: string;
  productId: string;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  days: number;
  pricePerDay: number;
  totalAmount: number;
  currency: Currency;
  status: 'pending' | 'active' | 'returned' | 'overdue' | 'cancelled';
  returnDate?: string;
  deposit?: number;
  depositReturned?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  targetType?: 'product' | 'librairie';
  targetId?: string;
  productId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpful?: number;
  verified?: boolean;
  response?: {
    comment: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'rental' | 'review' | 'promotion' | 'system';
  title: string;
  message: string;
  icon?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  librarieId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  productIds?: string[];
  categoryIds?: string[];
  startDate: string;
  endDate: string;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export interface Stats {
  period: 'today' | 'week' | 'month' | 'year';
  revenue: number;
  orders: number;
  rentals: number;
  customers: number;
  products: number;
  avgRating: number;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'product' | 'librairie' | 'review' | 'user';
  targetId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: ProductType;
  condition?: string[];
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'distance';
  page?: number;
  limit?: number;
}
