import { createContext, useContext, useState, ReactNode } from 'react';

export interface Rental {
  id: string;
  productId: string;
  libraryId: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'active' | 'pending_return' | 'returned' | 'cancelled';
  totalAmount: number;
  pricePerDay: number;
  deposit?: number;
  depositReturned?: boolean;
  actualReturnDate?: string;
}

interface RentalsContextType {
  rentals: Rental[];
  addRental: (rental: Omit<Rental, 'id' | 'status'>) => void;
  requestReturn: (rentalId: string) => void;
  validateReturn: (rentalId: string) => void;
}

const RentalsContext = createContext<RentalsContextType | undefined>(undefined);

export function RentalsProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const addRental = (rentalData: Omit<Rental, 'id' | 'status'>) => {
    const newRental: Rental = {
      ...rentalData,
      id: `rental-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'active',
    };
    setRentals(prev => [newRental, ...prev]);
  };

  const requestReturn = (rentalId: string) => {
    setRentals(prev =>
      prev.map(r => r.id === rentalId ? { ...r, status: 'pending_return' as const } : r)
    );
  };

  const validateReturn = (rentalId: string) => {
    setRentals(prev =>
      prev.map(r =>
        r.id === rentalId
          ? { ...r, status: 'returned' as const, actualReturnDate: new Date().toISOString(), depositReturned: true }
          : r
      )
    );
  };

  return (
    <RentalsContext.Provider value={{ rentals, addRental, requestReturn, validateReturn }}>
      {children}
    </RentalsContext.Provider>
  );
}

export function useRentals() {
  const context = useContext(RentalsContext);
  if (!context) throw new Error('useRentals must be used within RentalsProvider');
  return context;
}
