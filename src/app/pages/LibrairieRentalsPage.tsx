import { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import {
  Calendar, Package, Clock, CheckCircle, AlertCircle, TrendingUp, X
} from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useLibraryRentals } from '../context/LibraryRentalsContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationsContext';
import { Rental } from '../types';

interface ReturnModalState {
  rental: Rental;
  condition: 'new' | 'good' | 'damaged';
  depositReturned: boolean;
  notes: string;
}

export function LibrairieRentalsPage() {
  const { formatPrice } = useLocalization();
  const { user } = useAuth();
  const { getLibraryRentals, confirmReturn, updateRentalStatus } = useLibraryRentals();
  const { creditWallet } = useWallet();
  const { addNotification } = useNotifications();

  const libraryId = user?.id || 'lib-1';
  const rentals = getLibraryRentals(libraryId);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [returnModal, setReturnModal] = useState<ReturnModalState | null>(null);

  const isOverdue = (rental: Rental) => {
    if (rental.status === 'returned') return false;
    return new Date(rental.endDate) < new Date();
  };

  const openReturnModal = (rental: Rental) => {
    setReturnModal({
      rental,
      condition: 'good',
      depositReturned: true,
      notes: '',
    });
  };

  const handleConfirmReturn = () => {
    if (!returnModal) return;
    confirmReturn(returnModal.rental.id, {
      onWalletCredit: (amount, desc, meta) => creditWallet(amount, desc, meta),
      onNotify: (notif) => addNotification(notif),
    });
    setReturnModal(null);
  };

  const filteredRentals =
    filterStatus === 'all'
      ? rentals
      : filterStatus === 'active'
      ? rentals.filter(r => r.status === 'active')
      : filterStatus === 'overdue'
      ? rentals.filter(r => isOverdue(r))
      : rentals.filter(r => r.status === filterStatus);

  const totalRentals = rentals.length;
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const overdueRentals = rentals.filter(r => isOverdue(r)).length;
  const totalRevenue = rentals
    .filter(r => r.status === 'returned')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const getStatusColor = (rental: Rental) => {
    if (isOverdue(rental)) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    switch (rental.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'returned': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (rental: Rental) => {
    if (isOverdue(rental)) return 'En retard';
    const labels: Record<string, string> = {
      pending: 'En attente',
      active: 'En cours',
      returned: 'Retournée',
      cancelled: 'Annulée',
    };
    return labels[rental.status] || rental.status;
  };

  const getDaysRemaining = (rental: Rental) => {
    if (rental.status === 'returned') return 0;
    const end = new Date(rental.endDate).getTime();
    const now = new Date().getTime();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Locations Actives</h1>
              <p className="text-sm text-muted-foreground">Gérez et suivez toutes vos locations en cours</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Locations</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRentals}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En Cours</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{activeRentals}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En Retard</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueRentals}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenu Total</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'active', 'overdue', 'returned'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {status === 'all' ? 'Toutes' : status === 'active' ? 'En cours' : status === 'overdue' ? 'En retard' : 'Retournées'}
              <span className="ml-2 text-xs opacity-80">
                ({status === 'all' ? rentals.length
                  : status === 'overdue' ? rentals.filter(r => isOverdue(r)).length
                  : rentals.filter(r => r.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Rentals List */}
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const product = MOCK_PRODUCTS.find(p => p.id === rental.productId);
            const daysRemaining = getDaysRemaining(rental);
            const overdueStatus = isOverdue(rental);

            return (
              <div
                key={rental.id}
                className={`bg-card rounded-xl border overflow-hidden transition-all hover:shadow-md ${
                  overdueStatus ? 'border-red-500' : 'border-border'
                }`}
              >
                {overdueStatus && (
                  <div className="bg-red-50 dark:bg-red-950/20 text-white px-6 py-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Location en retard — Contactez le client</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {product && (
                        <div className="w-16 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Location #{rental.id.slice(0, 8).toUpperCase()}
                        </p>
                        {product && (
                          <>
                            <h3 className="font-bold text-lg">{product.title}</h3>
                            {product.author && <p className="text-sm text-muted-foreground">{product.author}</p>}
                          </>
                        )}
                        {rental.deposit && (
                          <p className="text-xs mt-1">
                            <span className="text-muted-foreground">Caution:</span>{' '}
                            <span className="font-semibold">{formatPrice(rental.deposit)}</span>
                            {rental.depositReturned && (
                              <span className="ml-2 text-green-600 text-xs">✓ Restituée</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(rental)}`}>
                      {getStatusLabel(rental)}
                    </span>
                  </div>

                  {/* Progress bar for active rentals */}
                  {rental.status !== 'returned' && rental.status !== 'cancelled' && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Progression</span>
                        <span className={`text-xs font-medium ${daysRemaining <= 0 ? 'text-red-600' : daysRemaining <= 2 ? 'text-yellow-600' : 'text-primary'}`}>
                          {daysRemaining > 0
                            ? `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`
                            : `${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? 's' : ''} de retard`}
                        </span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                            overdueStatus ? 'bg-red-500' : daysRemaining <= 2 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, ((rental.days - Math.max(0, daysRemaining)) / rental.days) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date de début
                      </p>
                      <p className="font-semibold text-sm">
                        {new Date(rental.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Fin prévue
                      </p>
                      <p className={`font-semibold text-sm ${overdueStatus ? 'text-red-600' : ''}`}>
                        {new Date(rental.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Durée
                      </p>
                      <p className="font-semibold text-sm">{rental.days} jour{rental.days > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Actual return date */}
                  {rental.actualReturnDate && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Retourné le{' '}
                        {new Date(rental.actualReturnDate).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Montant total</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(rental.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatPrice(rental.pricePerDay)}/jour × {rental.days} jours
                      </p>
                    </div>

                    {rental.status === 'returned' ? (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Portefeuille crédité
                      </span>
                    ) : (rental.status === 'active' || overdueStatus) && (
                      <button
                        onClick={() => openReturnModal(rental)}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Valider le retour
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRentals.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Aucune location</h2>
            <p className="text-muted-foreground">
              {filterStatus === 'all'
                ? "Vous n'avez pas encore de locations"
                : `Aucune location avec le statut "${
                    filterStatus === 'active' ? 'En cours' : filterStatus === 'overdue' ? 'En retard' : 'Retournées'
                  }"`}
            </p>
            {filterStatus !== 'all' && (
              <button onClick={() => setFilterStatus('all')} className="mt-4 text-sm text-primary hover:underline">
                Voir toutes les locations
              </button>
            )}
          </div>
        )}
      </div>

      {/* Return Confirmation Modal */}
      {returnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Valider le retour
              </h3>
              <button
                onClick={() => setReturnModal(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Product info */}
              {(() => {
                const product = MOCK_PRODUCTS.find(p => p.id === returnModal.rental.productId);
                return product ? (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Location #{returnModal.rental.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {formatPrice(returnModal.rental.totalAmount)}
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Condition */}
              <div>
                <label className="block text-sm font-semibold mb-2">État de retour du produit</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'new', label: 'Excellent', icon: '⭐', color: 'green' },
                    { value: 'good', label: 'Bon état', icon: '👍', color: 'blue' },
                    { value: 'damaged', label: 'Endommagé', icon: '⚠️', color: 'red' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setReturnModal({ ...returnModal, condition: opt.value as ReturnModalState['condition'] })}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        returnModal.condition === opt.value
                          ? opt.color === 'green'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : opt.color === 'blue'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xl mb-1">{opt.icon}</div>
                      <div className="text-xs font-medium">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit */}
              {returnModal.rental.deposit && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Caution de {formatPrice(returnModal.rental.deposit)}
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setReturnModal({ ...returnModal, depositReturned: true })}
                      className={`flex-1 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                        returnModal.depositReturned
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700'
                          : 'border-border hover:border-green-500/50'
                      }`}
                    >
                      ✓ Restituer la caution
                    </button>
                    <button
                      onClick={() => setReturnModal({ ...returnModal, depositReturned: false })}
                      className={`flex-1 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                        !returnModal.depositReturned
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700'
                          : 'border-border hover:border-red-500/50'
                      }`}
                    >
                      ✗ Retenir la caution
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold mb-2">Notes (optionnel)</label>
                <textarea
                  value={returnModal.notes}
                  onChange={(e) => setReturnModal({ ...returnModal, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring h-20 resize-none"
                  placeholder="Ex: rayure sur la couverture, pages cornées..."
                />
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de retour</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">État</span>
                  <span className="font-medium">
                    {returnModal.condition === 'new' ? 'Excellent' : returnModal.condition === 'good' ? 'Bon état' : 'Endommagé'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-1">
                  <span className="text-muted-foreground">Crédit portefeuille</span>
                  <span className="font-bold text-green-600">+{formatPrice(returnModal.rental.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setReturnModal(null)}
                className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReturn}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirmer le retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
