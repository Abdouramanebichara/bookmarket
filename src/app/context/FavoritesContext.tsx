import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '../types';

interface FavoritesContextType {
  favorites: Product[];
  favoriteIds: Set<string>;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
}

const FAVORITES_STORAGE_KEY = 'bookmarket_favorites';

function readFavorites(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>(readFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = new Set(favorites.map(p => p.id));

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      return [product, ...prev];
    });
  };

  const isFavorite = (productId: string) => favoriteIds.has(productId);

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
