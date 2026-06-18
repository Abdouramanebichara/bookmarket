import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useLocalization } from '../context/LocalizationContext';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle,
  XCircle, Smartphone, Building, TrendingUp, X, CreditCard,
  ShoppingBag, RefreshCw, Loader
} from 'lucide-react';
import { WalletWithdrawal, PaymentMethod } from '../types/wallet';
import { toast } from 'sonner';

export function LibrairieWalletPage() {
  const { wallet, allTransactions, withdrawFromWallet } = useWallet();
  const { formatPrice, language } = useLocalization();
  const fr = language === 'fr';

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txFilter, setTxFilter] = useState<'all' | 'sale' | 'withdrawal'>('all');
  const [form, setForm] = useState<WalletWithdrawal>({
    amount: 50000,
    paymentMethod: 'mtn_momo',
    phoneNumber: '',
  });

  // Filter transactions for this wallet directly from allTransactions
  const libTxns = wallet
    ? allTransactions.filter(t => t.walletId === wallet.id)
    : allTransactions.filter(t => t.walletId === 'wallet-librairie-1');

  const filtered = txFilter === 'all'
    ? libTxns
    : libTxns.filter(t => t.type === txFilter);

  const walletBalance = wallet?.balance ?? 198300;
  const walletPending = wallet?.pendingAmount ?? 7800;
  const walletTotalWithdrawn = wallet?.totalWithdrawn ?? 120000;
  const walletTotalReceived = wallet?.totalReceived ?? 390000;

  const totalSales = libTxns
    .filter(t => t.type === 'sale' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);

  const totalWithdrawn = libTxns
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);

  const pendingAmount = libTxns
    .filter(t => t.status === 'pending')
    .reduce((s, t) => s + t.amount, 0);

  const handleWithdraw = async () => {
    if (form.amount <= 0) {
      toast.error(fr ? 'Entrez un montant valide' : 'Enter a valid amount');
      return;
    }
    if (form.amount > walletBalance) {
      toast.error(fr ? 'Solde insuffisant' : 'Insufficient balance');
      return;
    }
    if (form.paymentMethod !== 'bank_transfer' && !form.phoneNumber.trim()) {
      toast.error(fr ? 'Entrez votre numéro de téléphone' : 'Enter your phone number');
      return;
    }
    setLoading(true);
    const ok = await withdrawFromWallet(form);
    setLoading(false);
    if (ok) {
      setShowModal(false);
      setForm({ amount: 50000, paymentMethod: 'mtn_momo', phoneNumber: '' });
    }
  };

  const methodLabel = (m: PaymentMethod) =>
    m === 'mtn_momo' ? 'MTN Mobile Money'
    : m === 'orange_money' ? 'Orange Money'
    : m === 'card' ? (fr ? 'Carte bancaire' : 'Credit Card')
    : fr ? 'Virement bancaire' : 'Bank Transfer';

  const methodIcon = (m: PaymentMethod) =>
    (m === 'mtn_momo' || m === 'orange_money')
      ? <Smartphone className="w-4 h-4" />
      : m === 'card' ? <CreditCard className="w-4 h-4" />
      : <Building className="w-4 h-4" />;

  const txTypeIcon = (type: string) =>
    type === 'sale' ? <ArrowDownLeft className="w-5 h-5 text-green-600" />
    : type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5 text-red-500" />
    : type === 'refund' ? <RefreshCw className="w-5 h-5 text-blue-500" />
    : <ShoppingBag className="w-5 h-5 text-muted-foreground" />;

  const statusChip = (status: string) =>
    status === 'completed'
      ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="w-3 h-3" />{fr ? 'Effectué' : 'Completed'}</span>
      : status === 'pending'
      ? <span className="flex items-center gap-1 text-xs text-orange-500"><Clock className="w-3 h-3" />{fr ? 'En attente' : 'Pending'}</span>
      : <span className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3 h-3" />{fr ? 'Échoué' : 'Failed'}</span>;

  const fmtDate = (d: Date | string) =>
    new Date(d).toLocaleDateString(fr ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center shadow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold break-words">{fr ? 'Mon Portefeuille' : 'My Wallet'}</h1>
              <p className="text-sm text-muted-foreground">
                {fr ? 'Revenus, retraits et historique des transactions' : 'Revenue, withdrawals and transaction history'}
              </p>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Solde */}
          <div className="col-span-2 lg:col-span-1 bg-green-50 dark:bg-green-950/20 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-1">{fr ? 'Solde disponible' : 'Available Balance'}</p>
            <p className="text-2xl sm:text-3xl font-bold mb-4 break-words">{formatPrice(walletBalance)}</p>
            <button
              onClick={() => setShowModal(true)}
              disabled={walletBalance <= 0}
              className="w-full bg-white/20 hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors py-2 rounded-xl text-sm font-semibold"
            >
              {fr ? '↑ Retirer des fonds' : '↑ Withdraw Funds'}
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{fr ? 'Total des ventes' : 'Total Sales'}</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold break-words">{formatPrice(totalSales || walletTotalReceived)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fr ? 'Revenus confirmés' : 'Confirmed revenue'}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{fr ? 'Total retiré' : 'Total Withdrawn'}</p>
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold break-words">{formatPrice(totalWithdrawn || walletTotalWithdrawn)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fr ? 'Retraits effectués' : 'Withdrawals done'}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{fr ? 'En attente' : 'Pending'}</p>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-500 break-words">
              {formatPrice(pendingAmount || walletPending)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{fr ? 'En traitement' : 'In processing'}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-bold text-lg">{fr ? 'Historique des transactions' : 'Transaction History'}</h2>
            <div className="flex gap-1">
              {[
                { val: 'all' as const, labelFr: 'Tout', labelEn: 'All', active: 'bg-orange-600 text-white' },
                { val: 'sale' as const, labelFr: 'Ventes', labelEn: 'Sales', active: 'bg-green-600 text-white' },
                { val: 'withdrawal' as const, labelFr: 'Retraits', labelEn: 'Withdrawals', active: 'bg-red-600 text-white' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setTxFilter(opt.val)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    txFilter === opt.val ? opt.active : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {fr ? opt.labelFr : opt.labelEn}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Wallet className="w-14 h-14 text-muted-foreground mb-4" />
              <p className="font-medium text-muted-foreground mb-1">
                {txFilter === 'all'
                  ? (fr ? 'Aucune transaction pour le moment' : 'No transactions yet')
                  : txFilter === 'sale'
                  ? (fr ? 'Aucune vente enregistrée' : 'No sales recorded')
                  : (fr ? 'Aucun retrait effectué' : 'No withdrawals yet')}
              </p>
              <p className="text-xs text-muted-foreground">
                {fr
                  ? 'Les transactions apparaîtront ici dès la première vente.'
                  : 'Transactions will appear here after your first sale.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    {txTypeIcon(tx.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tx.description}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{fmtDate(tx.createdAt)}</span>
                      {tx.paymentMethod && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          {methodIcon(tx.paymentMethod)}
                          {methodLabel(tx.paymentMethod)}
                        </span>
                      )}
                      {tx.metadata?.customerName && (
                        <span className="text-xs text-muted-foreground">
                          👤 {tx.metadata.customerName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm ${
                      tx.type === 'sale' ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}>
                      {tx.type === 'sale' || tx.type === 'refund' ? '+' : '-'}
                      {formatPrice(tx.amount)}
                    </p>
                    <div className="mt-0.5">{statusChip(tx.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-5 py-3 bg-muted/30 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">
                {filtered.length} {fr ? 'transaction(s)' : 'transaction(s)'}
              </span>
              <span className="font-semibold text-green-600">
                +{formatPrice(filtered.filter(t => t.type === 'sale' && t.status === 'completed').reduce((s, t) => s + t.amount, 0))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal retrait */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{fr ? 'Demander un retrait' : 'Request Withdrawal'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Montant */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {fr ? 'Montant (FCFA)' : 'Amount (XAF)'}
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                  min={1}
                  step={1000}
                  max={walletBalance}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600 text-lg font-medium"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>{fr ? 'Disponible :' : 'Available:'} {formatPrice(walletBalance)}</span>
                </div>
                {/* Montants rapides */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[25000, 50000, 100000, 200000].map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, amount: a }))}
                      disabled={a > walletBalance}
                      className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                        form.amount === a
                          ? 'bg-orange-600 text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {a >= 1000 ? `${a / 1000}k` : a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Méthode */}
              <div>
                <label className="block text-sm font-medium mb-2">{fr ? 'Méthode de retrait' : 'Withdrawal Method'}</label>
                <div className="space-y-2">
                  {(['mtn_momo', 'orange_money', 'bank_transfer'] as PaymentMethod[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, paymentMethod: m }))}
                      className={`w-full flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all ${
                        form.paymentMethod === m
                          ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-border hover:border-orange-400'
                      }`}
                    >
                      <span className={form.paymentMethod === m ? 'text-orange-600' : 'text-muted-foreground'}>
                        {methodIcon(m)}
                      </span>
                      <span className="text-sm font-medium">{methodLabel(m)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Téléphone */}
              {form.paymentMethod !== 'bank_transfer' ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {fr ? 'Numéro de téléphone' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">
                  {fr
                    ? 'Le retrait sera enregistré avec la méthode virement bancaire.'
                    : 'The withdrawal will be recorded with the bank transfer method.'}
                </p>
              )}

              {/* Récap */}
              {form.amount > 0 && form.amount <= walletBalance && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-sm space-y-1.5">
                  <div className="flex justify-between font-bold text-orange-900 dark:text-orange-100">
                    <span>{fr ? 'Montant à retirer' : 'Amount to withdraw'}</span>
                    <span>{formatPrice(form.amount)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader className="w-5 h-5 animate-spin" /> {fr ? 'Traitement…' : 'Processing…'}</>
                  : fr ? 'Confirmer le retrait' : 'Confirm Withdrawal'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
