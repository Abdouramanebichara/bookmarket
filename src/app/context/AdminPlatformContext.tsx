import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CATEGORIES, MOCK_CLIENTS, MOCK_LIBRAIRIES, MOCK_ORDERS, MOCK_PRODUCTS } from '../data/mockData';
import { Category, Librairie, Product, UserRole, UploadedDocument } from '../types';
import { REMOVED_PRODUCTS_KEY, getRemovedProductIds, saveRemovedProductIds } from '../utils/platformStorage';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  type: UserRole;
  role: UserRole;
  phone?: string;
  avatar?: string;
  location?: string;
  city?: string;
  country?: string;
  active: boolean;
  createdAt: string;
}

export interface ManagedCategory extends Category {
  genres: string[];
  productsCount: number;
}

export interface ProductReportRecord {
  id: string;
  reporterId: string;
  reporterName: string;
  productId: string;
  productTitle: string;
  libraryId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  action?: 'removed' | 'kept' | 'none';
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettings {
  appName: string;
  maintenanceMode: boolean;
  defaultLanguage: 'fr' | 'en';
  defaultCurrency: 'XAF' | 'EUR' | 'USD';
  allowClientSignup: boolean;
  allowLibrarySignup: boolean;
  requireLibraryValidation: boolean;
  supportEmail: string;
  commissionRate: number;
  minPasswordLength: number;
  maxLoginAttempts: number;
}

interface AdminPlatformContextValue {
  users: AdminUserRecord[];
  libraries: Librairie[];
  products: Product[];
  categories: ManagedCategory[];
  productReports: ProductReportRecord[];
  settings: PlatformSettings;
  removedProductIds: string[];
  visibleProducts: Product[];
  toggleUserStatus: (userId: string) => void;
  toggleLibraryStatus: (libraryId: string) => void;
  toggleLibraryVerification: (libraryId: string) => void;
  addLibraryFromRequest: (input: { id?: string; ownerName: string; libraryName: string; email: string; phone: string; location: string; city?: string; country?: string; latitude?: number; longitude?: number; rccmNumber?: string; taxpayerNumber?: string; legalStatus?: string; documents?: UploadedDocument[] }) => void;
  addCategory: (category: Omit<ManagedCategory, 'id' | 'productsCount'>) => void;
  updateCategory: (categoryId: string, patch: Partial<ManagedCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  toggleCategoryStatus: (categoryId: string) => void;
  reportProduct: (input: Omit<ProductReportRecord, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'action'>) => void;
  markReportReviewing: (reportId: string) => void;
  dismissReport: (reportId: string) => void;
  removeReportedProduct: (reportId: string) => void;
  restoreProduct: (productId: string) => void;
  updateSettings: (patch: Partial<PlatformSettings>) => void;
}

const STORAGE = {
  users: 'bookmarket_admin_users',
  libraries: 'bookmarket_admin_libraries',
  categories: 'bookmarket_admin_categories',
  productReports: 'bookmarket_admin_product_reports',
  settings: 'bookmarket_admin_settings',
};

const defaultSettings: PlatformSettings = {
  appName: 'BookMarket',
  maintenanceMode: false,
  defaultLanguage: 'fr',
  defaultCurrency: 'XAF',
  allowClientSignup: true,
  allowLibrarySignup: true,
  requireLibraryValidation: true,
  supportEmail: 'support@bookmarket.cm',
  commissionRate: 5,
  minPasswordLength: 8,
  maxLoginAttempts: 5,
};

const seedAdminUsers: AdminUserRecord[] = [
  {
    id: 'admin-1',
    name: 'Administrateur BookMarket',
    email: 'admin@bookstore.cm',
    type: 'admin',
    role: 'admin',
    phone: '+237 690 00 00 00',
    location: 'Yaoundé, Cameroun',
    city: 'Yaoundé',
    country: 'Cameroun',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'client-test',
    name: 'Client test',
    email: 'client@bookstore.cm',
    type: 'client',
    role: 'client',
    phone: '+237 699 00 00 01',
    location: 'Centre-ville, Yaoundé',
    city: 'Yaoundé',
    country: 'Cameroun',
    active: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'librairie-test',
    name: 'Librairie des Peuples Noirs',
    email: 'librairie@bookstore.cm',
    type: 'librairie',
    role: 'librairie',
    phone: '+237 222 21 44 04',
    location: 'Centre-ville, Yaoundé',
    city: 'Yaoundé',
    country: 'Cameroun',
    active: true,
    createdAt: '2026-01-11',
  },
  ...MOCK_CLIENTS.map((client, index) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    type: 'client' as const,
    role: 'client' as const,
    phone: client.phone || `+237 69${index + 1} 00 10 2${index}`,
    avatar: client.avatar,
    location: client.location,
    city: client.city || 'Yaoundé',
    country: client.country || 'Cameroun',
    active: true,
    createdAt: client.createdAt || `2026-02-${String(index + 1).padStart(2, '0')}`,
  })),
  ...MOCK_LIBRAIRIES.map((library, index) => ({
    id: `user-${library.id}`,
    name: library.name,
    email: library.email || `${library.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@bookmarket.cm`,
    type: 'librairie' as const,
    role: 'librairie' as const,
    phone: library.phone,
    avatar: library.logo,
    location: `${library.location.address}, ${library.location.city}`,
    city: library.city || library.location.city,
    country: library.country || library.location.country,
    active: library.active !== false,
    createdAt: library.createdAt || `2026-03-${String(index + 1).padStart(2, '0')}`,
  })),
];

const seedCategories: ManagedCategory[] = CATEGORIES.map((category) => ({
  ...category,
  active: category.active ?? true,
  genres: category.slug === 'livres'
    ? ['Roman', 'Essai', 'Littérature africaine']
    : category.slug === 'manuels'
    ? ['Primaire', 'Secondaire', 'Universitaire']
    : category.slug === 'numerique'
    ? ['PDF', 'CD', 'DVD', 'USB']
    : [],
  productsCount: MOCK_PRODUCTS.filter((product) => product.categoryId === category.id).length,
}));

const seedReports: ProductReportRecord[] = [
  {
    id: 'report-prod-1',
    reporterId: 'client-test',
    reporterName: 'Client test',
    productId: 'prod-3',
    productTitle: 'La Bible - Version Louis Segond',
    libraryId: 'lib-4',
    reason: 'Image ou description à vérifier',
    description: 'Le client demande une vérification des informations du produit avant achat.',
    status: 'pending',
    action: 'none',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const AdminPlatformContext = createContext<AdminPlatformContextValue | undefined>(undefined);

export function AdminPlatformProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUserRecord[]>(() => readJSON(STORAGE.users, seedAdminUsers));
  const [libraries, setLibraries] = useState<Librairie[]>(() => readJSON(STORAGE.libraries, MOCK_LIBRAIRIES));
  const [categories, setCategories] = useState<ManagedCategory[]>(() => readJSON(STORAGE.categories, seedCategories));
  const [productReports, setProductReports] = useState<ProductReportRecord[]>(() => readJSON(STORAGE.productReports, seedReports));
  const [settings, setSettings] = useState<PlatformSettings>(() => readJSON(STORAGE.settings, defaultSettings));
  const [removedProductIds, setRemovedProductIds] = useState<string[]>(() => getRemovedProductIds());

  useEffect(() => writeJSON(STORAGE.users, users), [users]);

  useEffect(() => {
    const handleAdminUserCreated = (event: Event) => {
      const record = (event as CustomEvent<AdminUserRecord>).detail;
      if (!record?.email) return;
      setUsers((current) => current.some((user) => user.email.toLowerCase() === record.email.toLowerCase()) ? current : [record, ...current]);
    };
    window.addEventListener('bookmarket_admin_users_updated', handleAdminUserCreated as EventListener);
    return () => window.removeEventListener('bookmarket_admin_users_updated', handleAdminUserCreated as EventListener);
  }, []);

  useEffect(() => writeJSON(STORAGE.libraries, libraries), [libraries]);
  useEffect(() => writeJSON(STORAGE.categories, categories), [categories]);
  useEffect(() => writeJSON(STORAGE.productReports, productReports), [productReports]);
  useEffect(() => writeJSON(STORAGE.settings, settings), [settings]);
  useEffect(() => saveRemovedProductIds(removedProductIds), [removedProductIds]);

  const products = useMemo(() => MOCK_PRODUCTS.map((product) => ({
    ...product,
    available: product.available !== false && !removedProductIds.includes(product.id),
  })), [removedProductIds]);

  const visibleProducts = useMemo(() => products.filter((product) => product.available !== false), [products]);

  const toggleUserStatus = (userId: string) => {
    setUsers((current) => current.map((user) => {
      if (user.id !== userId || user.type === 'admin') return user;
      return { ...user, active: !user.active };
    }));
    toast.success('Statut du compte mis à jour');
  };

  const toggleLibraryStatus = (libraryId: string) => {
    const library = libraries.find((item) => item.id === libraryId);
    setLibraries((current) => current.map((item) => (
      item.id === libraryId ? { ...item, active: !item.active } : item
    )));
    setUsers((current) => current.map((user) => {
      const sameSystemUser = user.id === `user-${libraryId}` || user.id === 'librairie-test';
      const sameEmail = library?.email && user.email.toLowerCase() === library.email.toLowerCase();
      return sameSystemUser || sameEmail ? { ...user, active: !user.active } : user;
    }));
    toast.success('Statut de la librairie mis à jour');
  };

  const toggleLibraryVerification = (libraryId: string) => {
    setLibraries((current) => current.map((library) => (
      library.id === libraryId ? { ...library, verified: !library.verified } : library
    )));
    toast.success('Vérification de la librairie mise à jour');
  };

  const addLibraryFromRequest = (input: { id?: string; ownerName: string; libraryName: string; email: string; phone: string; location: string; city?: string; country?: string; latitude?: number; longitude?: number; rccmNumber?: string; taxpayerNumber?: string; legalStatus?: string; documents?: UploadedDocument[] }) => {
    const newLibraryId = input.id || `lib-${Date.now()}`;
    const city = input.city || 'Yaoundé';
    const country = input.country || 'Cameroun';
    const latitude = typeof input.latitude === 'number' && Number.isFinite(input.latitude) ? input.latitude : 3.848;
    const longitude = typeof input.longitude === 'number' && Number.isFinite(input.longitude) ? input.longitude : 11.5021;
    const newLibrary: Librairie = {
      id: newLibraryId,
      userId: `user-${newLibraryId}`,
      name: input.libraryName,
      email: input.email,
      phone: input.phone,
      address: input.location,
      city,
      country,
      latitude,
      longitude,
      location: {
        latitude,
        longitude,
        address: input.location,
        city,
        country,
      },
      ownerName: input.ownerName,
      rccmNumber: input.rccmNumber,
      taxpayerNumber: input.taxpayerNumber,
      legalStatus: input.legalStatus,
      validationStatus: 'approved',
      validationDocuments: input.documents || [],
      description: `Librairie créée par ${input.ownerName}. Profil validé par l’administrateur après contrôle du dossier administratif.`,
      logo: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&h=200&fit=crop&auto=format',
      banner: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=500&fit=crop&auto=format',
      coverImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=500&fit=crop&auto=format',
      openingHours: 'À configurer',
      rating: 0,
      reviewsCount: 0,
      productsCount: 0,
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'Demande validée par administrateur',
      googleMapsQuery: `${input.libraryName} ${input.location} ${city} ${country}`,
    };
    setLibraries((current) => current.some((library) => library.email === input.email) ? current : [newLibrary, ...current]);
    setUsers((current) => current.some((user) => user.email.toLowerCase() === input.email.toLowerCase()) ? current : [{
      id: `user-${newLibraryId}`,
      name: input.libraryName,
      email: input.email,
      type: 'librairie',
      role: 'librairie',
      phone: input.phone,
      location: input.location,
      city,
      country,
      active: true,
      createdAt: new Date().toISOString(),
    }, ...current]);
    toast.success('Librairie ajoutée à la plateforme');
  };

  const addCategory = (category: Omit<ManagedCategory, 'id' | 'productsCount'>) => {
    const newCategory: ManagedCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      productsCount: 0,
      active: category.active ?? true,
      genres: category.genres || [],
    };
    setCategories((current) => [...current, newCategory]);
    toast.success('Catégorie ajoutée');
  };

  const updateCategory = (categoryId: string, patch: Partial<ManagedCategory>) => {
    setCategories((current) => current.map((category) => (
      category.id === categoryId ? { ...category, ...patch } : category
    )));
    toast.success('Catégorie mise à jour');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((current) => current.filter((category) => category.id !== categoryId));
    toast.success('Catégorie supprimée');
  };

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((current) => current.map((category) => (
      category.id === categoryId ? { ...category, active: !category.active } : category
    )));
    toast.success('Statut de la catégorie mis à jour');
  };

  const reportProduct = (input: Omit<ProductReportRecord, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'action'>) => {
    const alreadyPending = productReports.some((report) =>
      report.productId === input.productId &&
      report.reporterId === input.reporterId &&
      ['pending', 'reviewing'].includes(report.status)
    );
    if (alreadyPending) {
      toast.info('Vous avez déjà un signalement en cours pour ce livre.');
      return;
    }
    const now = new Date().toISOString();
    setProductReports((current) => [{
      ...input,
      id: `report-${Date.now()}`,
      status: 'pending',
      action: 'none',
      createdAt: now,
      updatedAt: now,
    }, ...current]);
    toast.success('Signalement envoyé à l’administrateur');
  };

  const markReportReviewing = (reportId: string) => {
    setProductReports((current) => current.map((report) => (
      report.id === reportId ? { ...report, status: 'reviewing', updatedAt: new Date().toISOString() } : report
    )));
  };

  const dismissReport = (reportId: string) => {
    setProductReports((current) => current.map((report) => (
      report.id === reportId ? { ...report, status: 'dismissed', action: 'kept', updatedAt: new Date().toISOString() } : report
    )));
    toast.success('Signalement classé sans retrait');
  };

  const removeReportedProduct = (reportId: string) => {
    const report = productReports.find((item) => item.id === reportId);
    if (!report) return;
    setRemovedProductIds((current) => Array.from(new Set([...current, report.productId])));
    localStorage.setItem(REMOVED_PRODUCTS_KEY, JSON.stringify(Array.from(new Set([...removedProductIds, report.productId]))));
    setProductReports((current) => current.map((item) => (
      item.id === reportId ? { ...item, status: 'resolved', action: 'removed', updatedAt: new Date().toISOString() } : item
    )));
    toast.success('Livre retiré de la plateforme');
  };

  const restoreProduct = (productId: string) => {
    setRemovedProductIds((current) => current.filter((id) => id !== productId));
    toast.success('Livre réactivé');
  };

  const updateSettings = (patch: Partial<PlatformSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
    toast.success('Paramètres de l’application sauvegardés');
  };

  return (
    <AdminPlatformContext.Provider value={{
      users,
      libraries,
      products,
      categories,
      productReports,
      settings,
      removedProductIds,
      visibleProducts,
      toggleUserStatus,
      toggleLibraryStatus,
      toggleLibraryVerification,
      addLibraryFromRequest,
      addCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryStatus,
      reportProduct,
      markReportReviewing,
      dismissReport,
      removeReportedProduct,
      restoreProduct,
      updateSettings,
    }}>
      {children}
    </AdminPlatformContext.Provider>
  );
}

export function useAdminPlatform() {
  const context = useContext(AdminPlatformContext);
  if (!context) throw new Error('useAdminPlatform must be used within AdminPlatformProvider');
  return context;
}

export function isAccountDisabled(email: string): boolean {
  const users = readJSON<AdminUserRecord[]>(STORAGE.users, seedAdminUsers);
  const normalizedEmail = email.trim().toLowerCase();
  return users.some((user) => user.email.toLowerCase() === normalizedEmail && user.active === false);
}
