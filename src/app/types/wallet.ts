export type TransactionType = 'recharge' | 'purchase' | 'sale' | 'withdrawal' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'card' | 'bank_transfer';

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  description: string;
  orderId?: string;
  productId?: string;
  recipientId?: string;
  createdAt: Date;
  completedAt?: Date;
  metadata?: {
    productName?: string;
    customerName?: string;
    librarianName?: string;
    [key: string]: any;
  };
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  pendingAmount: number;
  totalReceived: number;
  totalSpent: number;
  totalWithdrawn: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletRecharge {
  amount: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export interface WalletWithdrawal {
  amount: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  reason?: string;
}
