import { useState, useMemo } from 'react';
import { useWallet } from '../context/WalletContext';
import { useLocalization } from '../context/LocalizationContext';
import { useNotifications } from '../context/NotificationsContext';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle,
  XCircle, CreditCard, Smartphone, Building, Plus, X, Filter
} from 'lucide-react';
import { WalletRecharge, WalletWithdrawal, PaymentMethod } from '../types/wallet';
import { toast } from 'sonner';

export function ClientWalletPage() {
  const { wallet, transactions, rechargeWallet, withdrawFromWallet } = useWallet();
  const { formatPrice, language } = useLocalization();
  const { addNotification } = useNotifications();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');

  const [rechargeForm, setRechargeForm] = useState<WalletRecharge>({
    amount: 10000,
    paymentMethod: 'mtn_momo',
    phoneNumber: '',
  });

  const [withdrawalForm, setWithdrawalForm] = useState<WalletWithdrawal>({
    amount: 5000,
    paymentMethod: 'mtn_momo',
    phoneNumber: '',
  });

  const handleRecharge = async () => {
    if (rechargeForm.amount < 1000) {
      toast.error(language === 'fr' ? 'Montant minimum: 1000 FCFA' : 'Minimum amount: 1000 XAF');
      return;
    }

    if (rechargeForm.paymentMethod !== 'card' && !rechargeForm.phoneNumber) {
      toast.error(language === 'fr' ? 'Veuillez entrer votre numéro de téléphone' : 'Please enter your phone number');
      return;
    }

    setLoading(true);
    const success = await rechargeWallet(rechargeForm);
    setLoading(false);

    if (success) {
      addNotification({
        type: 'wallet_recharged',
        title: language === 'fr' ? '💰 Portefeuille rechargé' : '💰 Wallet recharged',
        message: language === 'fr'
          ? `${rechargeForm.amount.toLocaleString()} FCFA ont été ajoutés à votre portefeuille.`
          : `${rechargeForm.amount.toLocaleString()} XAF have been added to your wallet.`,
        link: '/wallet',
      });
      setShowRechargeModal(false);
      setRechargeForm({
        amount: 10000,
        paymentMethod: 'mtn_momo',
        phoneNumber: '',
      });
    }
  };


  const handleWithdrawal = async () => {
    if (!wallet) return;
    if (withdrawalForm.amount <= 0) {
      toast.error(language === 'fr' ? 'Entrez un montant valide' : 'Enter a valid amount');
      return;
    }
    if (withdrawalForm.amount > wallet.balance) {
      toast.error(language === 'fr' ? 'Solde insuffisant' : 'Insufficient balance');
      return;
    }
    if (withdrawalForm.paymentMethod !== 'bank_transfer' && !withdrawalForm.phoneNumber?.trim()) {
      toast.error(language === 'fr' ? 'Veuillez entrer votre numéro de téléphone' : 'Please enter your phone number');
      return;
    }

    setLoading(true);
    const success = await withdrawFromWallet(withdrawalForm);
    setLoading(false);

    if (success) {
      addNotification({
        type: 'wallet_withdrawal',
        title: language === 'fr' ? '🏧 Retrait effectué' : '🏧 Withdrawal completed',
        message: language === 'fr'
          ? `${withdrawalForm.amount.toLocaleString()} FCFA ont été retirés de votre portefeuille.`
          : `${withdrawalForm.amount.toLocaleString()} XAF have been withdrawn from your wallet.`,
        link: '/wallet',
      });
      setShowWithdrawalModal(false);
      setWithdrawalForm({ amount: 5000, paymentMethod: 'mtn_momo', phoneNumber: '' });
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'mtn_momo':
      case 'orange_money':
        return <Smartphone className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <Building className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'mtn_momo':
        return 'MTN Mobile Money';
      case 'orange_money':
        return 'Orange Money';
      case 'card':
        return language === 'fr' ? 'Carte bancaire' : 'Credit Card';
      case 'bank_transfer':
        return language === 'fr' ? 'Virement bancaire' : 'Bank Transfer';
      default:
        return method;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
      case 'purchase':
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-600" />;
      case 'refund':
        return <ArrowDownLeft className="w-5 h-5 text-blue-600" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            {language === 'fr' ? 'Réussi' : 'Completed'}
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
            <Clock className="w-3 h-3" />
            {language === 'fr' ? 'En attente' : 'Pending'}
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            {language === 'fr' ? 'Échoué' : 'Failed'}
          </span>
        );
      default:
        return null;
    }
  };

  // Filter transactions based on type
  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'all') return transactions;
    if (transactionFilter === 'income') {
      return transactions.filter(t => t.type === 'recharge' || t.type === 'refund');
    }
    if (transactionFilter === 'expense') {
      return transactions.filter(t => t.type === 'purchase' || t.type === 'withdrawal');
    }
    return transactions;
  }, [transactions, transactionFilter]);

  // Quick amount buttons
  const quickAmounts = [5000, 10000, 25000, 50000];

  if (!wallet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Wallet non trouvé' : 'Wallet not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            {language === 'fr' ? 'Mon Wallet' : 'My Wallet'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Gérez votre solde et vos transactions' : 'Manage your balance and transactions'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-primary rounded-xl p-6 text-primary-foreground shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm opacity-90">
                  {language === 'fr' ? 'Solde disponible' : 'Available Balance'}
                </span>
                <Wallet className="w-5 h-5 opacity-90" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-6 break-words">{formatPrice(wallet.balance)}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg hover:bg-white/30 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  {language === 'fr' ? 'Recharger' : 'Recharge'}
                </button>
                <button
                  onClick={() => setShowWithdrawalModal(true)}
                  disabled={wallet.balance <= 0}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  {language === 'fr' ? 'Retirer' : 'Withdraw'}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-card rounded-xl border border-border p-6">
              <h3 className="font-bold mb-4">
                {language === 'fr' ? 'Statistiques' : 'Statistics'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Total reçu' : 'Total Received'}
                  </span>
                  <span className="font-medium text-right break-words">{formatPrice(wallet.totalReceived)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Total dépensé' : 'Total Spent'}
                  </span>
                  <span className="font-medium text-right break-words">{formatPrice(wallet.totalSpent)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Total retiré' : 'Total Withdrawn'}
                  </span>
                  <span className="font-medium text-right break-words">{formatPrice(wallet.totalWithdrawn)}</span>
                </div>
                {wallet.pendingAmount > 0 && (
                  <div className="flex justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {language === 'fr' ? 'En attente' : 'Pending'}
                    </span>
                    <span className="font-medium text-orange-600 text-right break-words">{formatPrice(wallet.pendingAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transactions History */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {language === 'fr' ? 'Historique des transactions' : 'Transaction History'}
                </h2>
                <Filter className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTransactionFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      transactionFilter === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {language === 'fr' ? 'Tout' : 'All'}
                  </button>
                  <button
                    onClick={() => setTransactionFilter('income')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      transactionFilter === 'income'
                        ? 'bg-green-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    {language === 'fr' ? 'Dépôts' : 'Income'}
                  </button>
                  <button
                    onClick={() => setTransactionFilter('expense')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      transactionFilter === 'expense'
                        ? 'bg-red-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    {language === 'fr' ? 'Dépenses' : 'Expenses'}
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {filteredTransactions.length} {language === 'fr' ? 'transaction(s)' : 'transaction(s)'}
                </span>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    {transactionFilter === 'all'
                      ? (language === 'fr' ? 'Aucune transaction' : 'No transactions')
                      : transactionFilter === 'income'
                      ? (language === 'fr' ? 'Aucun dépôt' : 'No deposits')
                      : (language === 'fr' ? 'Aucune dépense' : 'No expenses')
                    }
                  </p>
                  {transactionFilter !== 'all' && (
                    <button
                      onClick={() => setTransactionFilter('all')}
                      className="text-sm text-primary hover:underline"
                    >
                      {language === 'fr' ? 'Voir toutes les transactions' : 'View all transactions'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{transaction.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {transaction.paymentMethod && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getPaymentMethodIcon(transaction.paymentMethod)}
                              {getPaymentMethodLabel(transaction.paymentMethod)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className={`font-bold ${
                          transaction.type === 'recharge' || transaction.type === 'refund'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'recharge' || transaction.type === 'refund' ? '+' : '-'}
                          {formatPrice(transaction.amount)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recharge Modal */}
        {showRechargeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'fr' ? 'Recharger mon wallet' : 'Recharge Wallet'}
                </h3>
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'fr' ? 'Montant' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={rechargeForm.amount}
                    onChange={(e) => setRechargeForm({ ...rechargeForm, amount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="10000"
                    min="1000"
                    step="1000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'fr' ? 'Montant minimum: 1000 FCFA' : 'Minimum amount: 1000 XAF'}
                  </p>

                  {/* Quick Amounts */}
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      {language === 'fr' ? 'Montants rapides:' : 'Quick amounts:'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setRechargeForm({ ...rechargeForm, amount })}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            rechargeForm.amount === amount
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {formatPrice(amount)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'fr' ? 'Méthode de paiement' : 'Payment Method'}
                  </label>
                  <div className="space-y-2">
                    {(['mtn_momo', 'orange_money', 'card'] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        onClick={() => setRechargeForm({ ...rechargeForm, paymentMethod: method })}
                        className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                          rechargeForm.paymentMethod === method
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {getPaymentMethodIcon(method)}
                        <span className="font-medium">{getPaymentMethodLabel(method)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Number for Mobile Money */}
                {(rechargeForm.paymentMethod === 'mtn_momo' || rechargeForm.paymentMethod === 'orange_money') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={rechargeForm.phoneNumber}
                      onChange={(e) => setRechargeForm({ ...rechargeForm, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                )}

                {/* Recharge Summary */}
                {rechargeForm.amount >= 1000 && (
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <p className="text-sm font-medium mb-2">
                      {language === 'fr' ? 'Récapitulatif' : 'Summary'}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">{language === 'fr' ? 'Montant:' : 'Amount:'}</span>
                        <span className="font-medium">{formatPrice(rechargeForm.amount)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">{language === 'fr' ? 'Frais:' : 'Fee:'}</span>
                        <span className="font-medium">{formatPrice(0)}</span>
                      </div>
                      <div className="pt-2 border-t border-primary/20 flex justify-between font-bold">
                        <span>{language === 'fr' ? 'Total à payer:' : 'Total to pay:'}</span>
                        <span className="text-primary">{formatPrice(rechargeForm.amount)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleRecharge}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                      {language === 'fr' ? 'Traitement...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {language === 'fr' ? 'Recharger' : 'Recharge'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Modal */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'fr' ? 'Retirer de mon wallet' : 'Withdraw from Wallet'}
                </h3>
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'fr' ? 'Montant' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={withdrawalForm.amount}
                    onChange={(e) => setWithdrawalForm({ ...withdrawalForm, amount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="5000"
                    min="1"
                    step="500"
                    max={wallet.balance}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'fr' ? 'Solde disponible :' : 'Available balance:'} {formatPrice(wallet.balance)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'fr' ? 'Méthode de retrait' : 'Withdrawal Method'}
                  </label>
                  <div className="space-y-2">
                    {(['mtn_momo', 'orange_money', 'bank_transfer'] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setWithdrawalForm({ ...withdrawalForm, paymentMethod: method })}
                        className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                          withdrawalForm.paymentMethod === method
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {getPaymentMethodIcon(method)}
                        <span className="font-medium">{getPaymentMethodLabel(method)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {(withdrawalForm.paymentMethod === 'mtn_momo' || withdrawalForm.paymentMethod === 'orange_money') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={withdrawalForm.phoneNumber}
                      onChange={(e) => setWithdrawalForm({ ...withdrawalForm, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                )}

                {withdrawalForm.paymentMethod === 'bank_transfer' && (
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                    {language === 'fr'
                      ? 'Le retrait sera enregistré avec la méthode virement bancaire.'
                      : 'The withdrawal will be recorded with the bank transfer method.'}
                  </div>
                )}

                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === 'fr' ? 'Montant à retirer :' : 'Amount to withdraw:'}</span>
                    <span className="font-bold text-primary">{formatPrice(Math.max(0, withdrawalForm.amount || 0))}</span>
                  </div>
                </div>

                <button
                  onClick={handleWithdrawal}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                      {language === 'fr' ? 'Traitement...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5" />
                      {language === 'fr' ? 'Confirmer le retrait' : 'Confirm withdrawal'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
