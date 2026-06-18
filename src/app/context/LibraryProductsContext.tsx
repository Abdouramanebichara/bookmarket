import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

export interface LibraryProduct extends Omit<Product, 'id' | 'librarieId' | 'rating' | 'reviewsCount' | 'featured'> {
  id: string;
  librarieId: string;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  active: boolean; // true = visible, false = désactivé
  createdAt: string;
}

interface LibraryProductsContextType {
  libraryProducts: LibraryProduct[];
  addProduct: (data: Omit<LibraryProduct, 'id' | 'rating' | 'reviewsCount' | 'featured' | 'active' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<LibraryProduct>) => void;
  toggleProductActive: (id: string) => void;
  getLibraryProducts: (libraryId: string) => LibraryProduct[];
}

const LibraryProductsContext = createContext<LibraryProductsContextType | undefined>(undefined);

// Seed with existing mock products marked as active
const seedProducts: LibraryProduct[] = MOCK_PRODUCTS.map(p => ({
  ...p,
  active: true,
  createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
}));

export function LibraryProductsProvider({ children }: { children: ReactNode }) {
  const [libraryProducts, setLibraryProducts] = useState<LibraryProduct[]>(seedProducts);

  const addProduct = (data: Omit<LibraryProduct, 'id' | 'rating' | 'reviewsCount' | 'featured' | 'active' | 'createdAt'>) => {
    const newProduct: LibraryProduct = {
      ...data,
      id: `prod-custom-${Date.now()}`,
      rating: 0,
      reviewsCount: 0,
      featured: false,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setLibraryProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, data: Partial<LibraryProduct>) => {
    setLibraryProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const toggleProductActive = (id: string) => {
    setLibraryProducts(prev =>
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
  };

  const getLibraryProducts = (libraryId: string) =>
    libraryProducts.filter(p => p.librarieId === libraryId);

  return (
    <LibraryProductsContext.Provider value={{ libraryProducts, addProduct, updateProduct, toggleProductActive, getLibraryProducts }}>
      {children}
    </LibraryProductsContext.Provider>
  );
}

export function useLibraryProducts() {
  const context = useContext(LibraryProductsContext);
  if (!context) throw new Error('useLibraryProducts must be used within LibraryProductsProvider');
  return context;
}
