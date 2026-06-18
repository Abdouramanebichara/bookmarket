import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, type: 'sale' | 'rental' | 'digital', quantity?: number, rentalDays?: number) => boolean;
  removeFromCart: (productId: string, type: 'sale' | 'rental' | 'digital') => void;
  updateQuantity: (productId: string, type: 'sale' | 'rental' | 'digital', quantity: number) => void;
  updateRentalDays: (productId: string, days: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      localStorage.removeItem('cart');
    }
  }, [isAuthenticated]);

  const addToCart = (
    product: Product,
    type: 'sale' | 'rental' | 'digital',
    quantity: number = 1,
    rentalDays?: number
  ) => {
    if (!isAuthenticated || !user) {
      toast.error('Connectez-vous comme client pour ajouter au panier.');
      return false;
    }

    if (user.type !== 'client') {
      toast.error('Seul un compte client peut ajouter des produits au panier.');
      return false;
    }

    if (product.available === false) {
      toast.error('Ce produit n’est plus disponible sur la plateforme.');
      return false;
    }

    const safeQuantity = type === 'digital' ? 1 : Math.max(1, quantity || 1);

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.type === type);
      if (existing) {
        if (type === 'digital') {
          return prev.map((item) =>
            item.productId === product.id && item.type === type
              ? { ...item, quantity: 1 }
              : item
          );
        }
        return prev.map((item) =>
          item.productId === product.id && item.type === type
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        );
      }
      return [...prev, { productId: product.id, type, quantity: safeQuantity, rentalDays: rentalDays ?? (type === 'rental' ? 7 : undefined) }];
    });
    return true;
  };

  const removeFromCart = (productId: string, type: 'sale' | 'rental' | 'digital') => {
    setItems((prev) => prev.filter((item) => !(item.productId === productId && item.type === type)));
  };

  const updateQuantity = (productId: string, type: 'sale' | 'rental' | 'digital', quantity: number) => {
    if (type === 'digital') {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId && item.type === type ? { ...item, quantity: 1 } : item
        )
      );
      return;
    }
    if (quantity <= 0) {
      removeFromCart(productId, type);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.type === type ? { ...item, quantity } : item
      )
    );
  };

  const updateRentalDays = (productId: string, days: number) => {
    if (days < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.type === 'rental' ? { ...item, rentalDays: days } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateRentalDays,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
