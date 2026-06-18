import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MOCK_ORDERS } from '../data/mockData';
import { Order } from '../types';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface LibraryOrdersContextType {
  orders: Order[];
  getLibraryOrders: (libraryId: string) => Order[];
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    callbacks?: {
      onWalletCredit?: (amount: number, desc: string, meta: any) => void;
      onNotify?: (notif: any) => void;
    }
  ) => void;
}

const LibraryOrdersContext = createContext<LibraryOrdersContextType | undefined>(undefined);

export function LibraryOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const getLibraryOrders = useCallback(
    (libraryId: string) => orders.filter(o => o.librarieId === libraryId),
    [orders]
  );

  const updateOrderStatus = useCallback((
    orderId: string,
    newStatus: OrderStatus,
    callbacks?: {
      onWalletCredit?: (amount: number, desc: string, meta: any) => void;
      onNotify?: (notif: any) => void;
    }
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const updated = { ...o, status: newStatus as any };

      // Trigger wallet credit when order is delivered
      if (newStatus === 'delivered' && o.status !== 'delivered') {
        callbacks?.onWalletCredit?.(
          o.totalAmount,
          `Vente livrée : commande #${orderId.replace('order-', '')}`,
          { orderId, customerName: o.shippingAddress?.name || 'Client' }
        );
        callbacks?.onNotify?.({
          type: 'order_confirmed',
          title: 'Commande livrée ✓',
          message: `La commande #${orderId.replace('order-', '')} a été livrée. +${o.totalAmount.toLocaleString()} FCFA crédités.`,
          link: '/librairie/wallet',
        });
      }

      // Notify on status change
      const statusLabels: Record<string, string> = {
        confirmed: 'confirmée',
        processing: 'en préparation',
        shipped: 'expédiée',
        cancelled: 'annulée',
      };
      if (statusLabels[newStatus] && newStatus !== 'delivered') {
        callbacks?.onNotify?.({
          type: 'order_shipped',
          title: `Commande ${statusLabels[newStatus]}`,
          message: `La commande #${orderId.replace('order-', '')} est maintenant ${statusLabels[newStatus]}.`,
          link: '/librairie/orders',
        });
      }

      return updated;
    }));

    const statusMessages: Record<string, string> = {
      confirmed: 'Commande confirmée',
      processing: 'En cours de préparation',
      shipped: 'Commande expédiée',
      delivered: 'Commande livrée — portefeuille crédité',
      cancelled: 'Commande annulée',
    };
    toast.success(statusMessages[newStatus] || 'Statut mis à jour');
  }, []);

  return (
    <LibraryOrdersContext.Provider value={{ orders, getLibraryOrders, updateOrderStatus }}>
      {children}
    </LibraryOrdersContext.Provider>
  );
}

export function useLibraryOrders() {
  const ctx = useContext(LibraryOrdersContext);
  if (!ctx) throw new Error('useLibraryOrders must be used within LibraryOrdersProvider');
  return ctx;
}
