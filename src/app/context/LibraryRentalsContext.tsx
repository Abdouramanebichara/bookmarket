import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MOCK_RENTALS } from '../data/mockData';
import { Rental } from '../types';
import { toast } from 'sonner';

type RentalStatus = 'pending' | 'active' | 'returned' | 'overdue' | 'cancelled';

interface LibraryRentalsContextType {
  rentals: Rental[];
  getLibraryRentals: (libraryId: string) => Rental[];
  confirmReturn: (
    rentalId: string,
    callbacks?: {
      onWalletCredit?: (amount: number, desc: string, meta: any) => void;
      onNotify?: (notif: any) => void;
    }
  ) => void;
  updateRentalStatus: (rentalId: string, status: RentalStatus) => void;
}

const LibraryRentalsContext = createContext<LibraryRentalsContextType | undefined>(undefined);

export function LibraryRentalsProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS);

  const getLibraryRentals = useCallback(
    (libraryId: string) => rentals.filter(r => r.librarieId === libraryId),
    [rentals]
  );

  const confirmReturn = useCallback((
    rentalId: string,
    callbacks?: {
      onWalletCredit?: (amount: number, desc: string, meta: any) => void;
      onNotify?: (notif: any) => void;
    }
  ) => {
    setRentals(prev => prev.map(r => {
      if (r.id !== rentalId) return r;
      const updated: Rental = {
        ...r,
        status: 'returned',
        actualReturnDate: new Date().toISOString(),
      };

      // Credit wallet for this rental
      callbacks?.onWalletCredit?.(
        r.totalAmount,
        `Location retournée : #${rentalId.replace('rental-', '')}`,
        { rentalId, productId: r.productId }
      );

      // Notify
      callbacks?.onNotify?.({
        type: 'rental_returned',
        title: 'Location retournée',
        message: `La location #${rentalId.replace('rental-', '')} a été retournée. +${r.totalAmount.toLocaleString()} FCFA crédités.`,
        link: '/librairie/wallet',
      });

      return updated;
    }));

    toast.success('Retour validé — portefeuille crédité');
  }, []);

  const updateRentalStatus = useCallback((rentalId: string, status: RentalStatus) => {
    setRentals(prev => prev.map(r =>
      r.id === rentalId ? { ...r, status: status as any } : r
    ));
  }, []);

  return (
    <LibraryRentalsContext.Provider value={{ rentals, getLibraryRentals, confirmReturn, updateRentalStatus }}>
      {children}
    </LibraryRentalsContext.Provider>
  );
}

export function useLibraryRentals() {
  const ctx = useContext(LibraryRentalsContext);
  if (!ctx) throw new Error('useLibraryRentals must be used within LibraryRentalsProvider');
  return ctx;
}
