import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Wallet, WalletTransaction, WalletRecharge, WalletWithdrawal } from '../types/wallet';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface WalletContextType {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  allTransactions: WalletTransaction[];
  rechargeWallet: (recharge: WalletRecharge) => Promise<boolean>;
  withdrawFromWallet: (withdrawal: WalletWithdrawal) => Promise<boolean>;
  deductFromWallet: (amount: number, description: string, metadata?: any) => Promise<boolean>;
  creditWallet: (amount: number, description: string, metadata?: any) => void;
  getTransactionHistory: () => WalletTransaction[];
  refreshWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock wallets and transactions - will be replaced with real data
const MOCK_WALLETS: Wallet[] = [
  {
    id: 'wallet-client-1',
    userId: 'client-1',
    balance: 68200, // 100000 (recharges completed) - 35000 (purchases) + 3200 (refund)
    currency: 'XAF',
    pendingAmount: 15000, // 1 pending recharge
    totalReceived: 115000, // All recharges including pending
    totalSpent: 35000, // All completed purchases
    totalWithdrawn: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'wallet-librairie-1',
    userId: 'librairie-1',
    balance: 198300, // 390000 (total sales) - 120000 (withdrawals) - 78300 (pending + other costs) + some previous balance
    currency: 'XAF',
    pendingAmount: 7800, // 1 pending sale
    totalReceived: 390000, // All completed sales (70500 from new transactions + 319500 from previous)
    totalSpent: 0,
    totalWithdrawn: 120000, // Total withdrawals
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date(),
  },
  {
    id: 'wallet-admin-1',
    userId: 'admin-1',
    balance: 0,
    currency: 'XAF',
    pendingAmount: 0,
    totalReceived: 0,
    totalSpent: 0,
    totalWithdrawn: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  // Client wallet transactions
  {
    id: 'txn-1',
    walletId: 'wallet-client-1',
    type: 'recharge',
    amount: 50000,
    status: 'completed',
    paymentMethod: 'mtn_momo',
    description: 'Recharge via MTN Mobile Money',
    createdAt: new Date('2024-05-15'),
    completedAt: new Date('2024-05-15'),
  },
  {
    id: 'txn-2',
    walletId: 'wallet-client-1',
    type: 'recharge',
    amount: 30000,
    status: 'completed',
    paymentMethod: 'orange_money',
    description: 'Recharge via Orange Money',
    createdAt: new Date('2024-05-28'),
    completedAt: new Date('2024-05-28'),
  },
  {
    id: 'txn-3',
    walletId: 'wallet-client-1',
    type: 'purchase',
    amount: 12500,
    status: 'completed',
    description: 'Achat de livre: Munyal - Les Larmes de la Patience',
    orderId: 'order-1',
    productId: 'prod-1',
    createdAt: new Date('2024-05-16'),
    completedAt: new Date('2024-05-16'),
    metadata: {
      productName: 'Munyal - Les Larmes de la Patience',
      librarianName: 'Librairie des Peuples Noirs',
    },
  },
  {
    id: 'txn-4',
    walletId: 'wallet-client-1',
    type: 'purchase',
    amount: 4500,
    status: 'completed',
    description: 'Achat PDF: Mathématiques Terminale C',
    orderId: 'order-2',
    productId: 'prod-5',
    createdAt: new Date('2024-05-20'),
    completedAt: new Date('2024-05-20'),
    metadata: {
      productName: 'Mathématiques Terminale C (PDF)',
      librarianName: 'Librairie Papeterie du Centre (LIPACE)',
      digitalProduct: true,
    },
  },
  {
    id: 'txn-5',
    walletId: 'wallet-client-1',
    type: 'purchase',
    amount: 8000,
    status: 'completed',
    description: 'Achat: Clé USB 64 Go - SanDisk',
    orderId: 'order-3',
    productId: 'prod-11',
    createdAt: new Date('2024-06-01'),
    completedAt: new Date('2024-06-01'),
    metadata: {
      productName: 'Clé USB 64 Go - SanDisk',
      librarianName: "L\'Harmattan Cameroun",
    },
  },
  {
    id: 'txn-6',
    walletId: 'wallet-client-1',
    type: 'purchase',
    amount: 3500,
    status: 'completed',
    description: 'Achat PDF: Histoire du Cameroun Contemporain',
    orderId: 'order-4',
    productId: 'prod-16',
    createdAt: new Date('2024-06-03'),
    completedAt: new Date('2024-06-03'),
    metadata: {
      productName: 'Histoire du Cameroun Contemporain (PDF)',
      librarianName: 'Librairie des Peuples Noirs',
      digitalProduct: true,
    },
  },
  {
    id: 'txn-7',
    walletId: 'wallet-client-1',
    type: 'recharge',
    amount: 20000,
    status: 'completed',
    paymentMethod: 'card',
    description: 'Recharge par Carte Bancaire',
    createdAt: new Date('2024-06-05'),
    completedAt: new Date('2024-06-05'),
  },
  {
    id: 'txn-8',
    walletId: 'wallet-client-1',
    type: 'purchase',
    amount: 6500,
    status: 'completed',
    description: 'Achat: Annales Baccalauréat Toutes Séries',
    orderId: 'order-5',
    productId: 'prod-7',
    createdAt: new Date('2024-06-06'),
    completedAt: new Date('2024-06-06'),
    metadata: {
      productName: 'Annales Baccalauréat Toutes Séries',
      librarianName: 'Librairie Papeterie du Centre (LIPACE)',
    },
  },
  {
    id: 'txn-9',
    walletId: 'wallet-client-1',
    type: 'refund',
    amount: 3200,
    status: 'completed',
    description: 'Remboursement: Champion Français CE2 (Retour)',
    orderId: 'order-6',
    productId: 'prod-8',
    createdAt: new Date('2024-06-04'),
    completedAt: new Date('2024-06-04'),
    metadata: {
      productName: 'Champion Français CE2',
      reason: 'Article défectueux',
    },
  },
  {
    id: 'txn-10',
    walletId: 'wallet-client-1',
    type: 'recharge',
    amount: 15000,
    status: 'pending',
    paymentMethod: 'mtn_momo',
    description: 'Recharge en cours via MTN Mobile Money',
    createdAt: new Date('2024-06-07'),
  },

  // Librairie wallet transactions
  {
    id: 'txn-lib-1',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 12500,
    status: 'completed',
    description: 'Vente: Munyal - Les Larmes de la Patience',
    orderId: 'order-1',
    productId: 'prod-1',
    createdAt: new Date('2024-05-16'),
    completedAt: new Date('2024-05-16'),
    metadata: {
      productName: 'Munyal - Les Larmes de la Patience',
      customerName: 'Marie Ngo Biyong',
    },
  },
  {
    id: 'txn-lib-2',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 14500,
    status: 'completed',
    description: 'Vente: Dictionnaire Larousse Français',
    orderId: 'order-7',
    productId: 'prod-14',
    createdAt: new Date('2024-05-18'),
    completedAt: new Date('2024-05-18'),
    metadata: {
      productName: 'Dictionnaire Larousse Français',
      customerName: 'Paul Essomba',
    },
  },
  {
    id: 'txn-lib-3',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 11000,
    status: 'completed',
    description: 'Vente: Les Impatientes',
    orderId: 'order-8',
    productId: 'prod-2',
    createdAt: new Date('2024-05-22'),
    completedAt: new Date('2024-05-22'),
    metadata: {
      productName: 'Les Impatientes',
      customerName: 'Françoise Mballa',
    },
  },
  {
    id: 'txn-lib-4',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 15000,
    status: 'completed',
    description: 'Vente: La Bible - Version Louis Segond',
    orderId: 'order-9',
    productId: 'prod-3',
    createdAt: new Date('2024-05-25'),
    completedAt: new Date('2024-05-25'),
    metadata: {
      productName: 'La Bible - Version Louis Segond',
      customerName: 'Jean Atangana',
    },
  },
  {
    id: 'txn-lib-5',
    walletId: 'wallet-librairie-1',
    type: 'withdrawal',
    amount: 70000,
    status: 'completed',
    paymentMethod: 'mtn_momo',
    description: 'Retrait vers MTN Mobile Money',
    createdAt: new Date('2024-05-28'),
    completedAt: new Date('2024-05-29'),
  },
  {
    id: 'txn-lib-6',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 3500,
    status: 'completed',
    description: 'Vente PDF: Histoire du Cameroun Contemporain',
    orderId: 'order-4',
    productId: 'prod-16',
    createdAt: new Date('2024-06-03'),
    completedAt: new Date('2024-06-03'),
    metadata: {
      productName: 'Histoire du Cameroun Contemporain (PDF)',
      customerName: 'Marie Ngo Biyong',
      digitalProduct: true,
    },
  },
  {
    id: 'txn-lib-7',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 5500,
    status: 'completed',
    description: 'Vente: Contes de Korotoumou',
    orderId: 'order-10',
    productId: 'prod-15',
    createdAt: new Date('2024-06-04'),
    completedAt: new Date('2024-06-04'),
    metadata: {
      productName: 'Contes de Korotoumou',
      customerName: 'Sophie Nkodo',
    },
  },
  {
    id: 'txn-lib-8',
    walletId: 'wallet-librairie-1',
    type: 'withdrawal',
    amount: 50000,
    status: 'completed',
    paymentMethod: 'orange_money',
    description: 'Retrait vers Orange Money',
    createdAt: new Date('2024-06-05'),
    completedAt: new Date('2024-06-06'),
  },
  {
    id: 'txn-lib-9',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 8500,
    status: 'completed',
    description: 'Vente: Mathématiques Terminale C',
    orderId: 'order-11',
    productId: 'prod-5',
    createdAt: new Date('2024-06-06'),
    completedAt: new Date('2024-06-06'),
    metadata: {
      productName: 'Mathématiques Terminale C',
      customerName: 'Ibrahim Moussa',
    },
  },
  {
    id: 'txn-lib-10',
    walletId: 'wallet-librairie-1',
    type: 'sale',
    amount: 7800,
    status: 'pending',
    description: 'Vente en traitement: Physique Terminale C & D',
    orderId: 'order-12',
    productId: 'prod-6',
    createdAt: new Date('2024-06-07'),
    metadata: {
      productName: 'Physique Terminale C & D',
      customerName: 'Achille Mbida',
    },
  },
];

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>(MOCK_WALLETS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);

  // Auto-create wallet for user if it doesn't exist yet (never call setState during render)
  useEffect(() => {
    if (!user) return;
    const exists = wallets.some(w => w.userId === user.id);
    if (!exists) {
      const newWallet: Wallet = {
        id: `wallet-${user.id}`,
        userId: user.id,
        balance: 0,
        currency: 'XAF',
        pendingAmount: 0,
        totalReceived: 0,
        totalSpent: 0,
        totalWithdrawn: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setWallets(prev => [...prev, newWallet]);
    }
  }, [user?.id]);

  const wallet = user ? wallets.find(w => w.userId === user.id) ?? null : null;

  const rechargeWallet = async (recharge: WalletRecharge): Promise<boolean> => {
    try {
      if (!wallet) {
        toast.error('Portefeuille non trouvé');
        return false;
      }

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update wallet balance
      setWallets(prev => prev.map(w =>
        w.id === wallet.id
          ? {
              ...w,
              balance: w.balance + recharge.amount,
              totalReceived: w.totalReceived + recharge.amount,
              updatedAt: new Date(),
            }
          : w
      ));

      // Add transaction
      const methodLabels: Record<string, string> = {
        mtn_momo: 'MTN Mobile Money',
        orange_money: 'Orange Money',
        card: 'Carte Bancaire',
        bank_transfer: 'Virement bancaire',
      };
      const newTxn: WalletTransaction = {
        id: `txn-${Date.now()}`,
        walletId: wallet.id,
        type: 'recharge',
        amount: recharge.amount,
        status: 'completed',
        paymentMethod: recharge.paymentMethod,
        description: `Recharge via ${methodLabels[recharge.paymentMethod] || recharge.paymentMethod}`,
        createdAt: new Date(),
        completedAt: new Date(),
      };
      setTransactions(prev => [newTxn, ...prev]);

      toast.success(`${recharge.amount.toLocaleString()} FCFA ajoutés à votre portefeuille !`);
      return true;
    } catch (error) {
      toast.error('Erreur lors de la recharge');
      return false;
    }
  };

  const withdrawFromWallet = async (withdrawal: WalletWithdrawal): Promise<boolean> => {
    try {
      if (!wallet) {
        toast.error('Portefeuille non trouvé');
        return false;
      }

      if (withdrawal.amount > wallet.balance) {
        toast.error('Solde insuffisant');
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update wallet balance
      setWallets(prev => prev.map(w =>
        w.id === wallet.id
          ? {
              ...w,
              balance: w.balance - withdrawal.amount,
              totalWithdrawn: w.totalWithdrawn + withdrawal.amount,
              updatedAt: new Date(),
            }
          : w
      ));

      // Add transaction
      const newTxn: WalletTransaction = {
        id: `txn-${Date.now()}`,
        walletId: wallet.id,
        type: 'withdrawal',
        amount: withdrawal.amount,
        status: 'completed',
        paymentMethod: withdrawal.paymentMethod,
        description: `Retrait vers ${withdrawal.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : withdrawal.paymentMethod === 'orange_money' ? 'Orange Money' : withdrawal.paymentMethod}`,
        createdAt: new Date(),
        completedAt: new Date(),
      };
      setTransactions(prev => [newTxn, ...prev]);

      toast.success(`Retrait de ${withdrawal.amount.toLocaleString()} FCFA effectué !`);
      return true;
    } catch (error) {
      toast.error('Erreur lors du retrait');
      return false;
    }
  };

  const deductFromWallet = async (
    amount: number,
    description: string,
    metadata?: any
  ): Promise<boolean> => {
    try {
      if (!wallet) {
        toast.error('Portefeuille non trouvé');
        return false;
      }

      if (amount > wallet.balance) {
        toast.error('Solde insuffisant dans votre portefeuille');
        return false;
      }

      // Deduct from balance
      setWallets(prev => prev.map(w =>
        w.id === wallet.id
          ? {
              ...w,
              balance: w.balance - amount,
              totalSpent: w.totalSpent + amount,
              updatedAt: new Date(),
            }
          : w
      ));

      // Add purchase transaction
      const newTxn: WalletTransaction = {
        id: `txn-${Date.now()}`,
        walletId: wallet.id,
        type: 'purchase',
        amount,
        status: 'completed',
        description,
        orderId: metadata?.orderId,
        createdAt: new Date(),
        completedAt: new Date(),
        metadata,
      };
      setTransactions(prev => [newTxn, ...prev]);

      return true;
    } catch (error) {
      toast.error('Erreur lors du paiement');
      return false;
    }
  };

  const creditWallet = (amount: number, description: string, metadata?: any) => {
    if (!user) return;
    const userId = user.id;
    setWallets(prev => {
      const targetWallet = prev.find(w => w.userId === userId);
      if (!targetWallet) return prev;
      const newTxn: WalletTransaction = {
        id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        walletId: targetWallet.id,
        type: 'sale',
        amount,
        status: 'completed',
        description,
        createdAt: new Date(),
        completedAt: new Date(),
        metadata,
      };
      setTransactions(tx => [newTxn, ...tx]);
      return prev.map(w =>
        w.userId === userId
          ? { ...w, balance: w.balance + amount, totalReceived: w.totalReceived + amount, updatedAt: new Date() }
          : w
      );
    });
  };

  const getTransactionHistory = (): WalletTransaction[] => {
    if (!wallet) return [];
    return transactions
      .filter(t => t.walletId === wallet.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const refreshWallet = () => {
    // In a real app, this would fetch the latest wallet data
    console.log('Refreshing wallet data...');
  };

  const sortedAllTransactions = [...transactions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions: getTransactionHistory(),
        allTransactions: sortedAllTransactions,
        rechargeWallet,
        withdrawFromWallet,
        deductFromWallet,
        creditWallet,
        getTransactionHistory,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

const EMPTY_WALLET_CONTEXT: WalletContextType = {
  wallet: null,
  transactions: [],
  allTransactions: [],
  rechargeWallet: async () => false,
  withdrawFromWallet: async () => false,
  deductFromWallet: async () => false,
  creditWallet: () => {},
  getTransactionHistory: () => [],
  refreshWallet: () => {},
};

export function useWallet() {
  const context = useContext(WalletContext);
  return context ?? EMPTY_WALLET_CONTEXT;
}
