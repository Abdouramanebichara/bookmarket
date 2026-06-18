import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useRentals } from '../context/RentalsContext';
import { useNotifications } from '../context/NotificationsContext';
import { MOCK_PRODUCTS, MOCK_LIBRAIRIES } from '../data/mockData';
import { Calendar, AlertCircle, Package, MapPin, Clock, TrendingUp, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export function RentalsPage() {
  const navigate = useNavigate();
  const { formatPrice, language } = useLocalization();
  const { rentals, requestReturn } = useRentals();
  const { addNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'active' | 'returned'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'pending_return': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'returned': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: language === 'fr' ? 'En cours' : 'Active',
      pending_return: language === 'fr' ? 'En attente de validation' : 'Pending Validation',
      returned: language === 'fr' ? 'Retournée' : 'Returned',
      cancelled: language === 'fr' ? 'Annulée' : 'Cancelled',
      overdue: language === 'fr' ? 'En retard' : 'Overdue',
    };
    return labels[status] || status;
  };

  const isOverdue = (endDate: string, status: string) => {
    if (status === 'returned' || status === 'cancelled') return false;
    return new Date(endDate) < new Date();
  };

  const getDaysRemaining = (endDate: string) => {
    const diff = new Date(endDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getRentalProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  };

  const filteredRentals = rentals.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'active') return r.status === 'active' || r.status === 'pending_return';
    if (filter === 'returned') return r.status === 'returned';
    return true;
  });

  const activeCount = rentals.filter(r => r.status === 'active' || r.status === 'pending_return').length;
  const returnedCount = rentals.filter(r => r.status === 'returned').length;

  const handleRequestReturn = (rentalId: string) => {
    requestReturn(rentalId);
    const rental = rentals.find(r => r.id === rentalId);
    const product = MOCK_PRODUCTS.find(p => p.id === rental?.productId);
    addNotification({
      type: 'rental_returned',
      title: language === 'fr' ? '🔄 Retour en cours de validation' : '🔄 Return pending validation',
      message: language === 'fr'
        ? `Votre demande de retour pour "${product?.title || 'le produit'}" est en attente de validation par la librairie.`
        : `Your return request for "${product?.title || 'the product'}" is awaiting library validation.`,
      link: '/rentals',
    });
    toast.success(
      language === 'fr'
        ? 'Demande de retour envoyée. En attente de validation par la librairie.'
        : 'Return request sent. Awaiting library validation.'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'fr' ? 'Mes Locations' : 'My Rentals'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Gérez vos locations en cours' : 'Manage your rentals'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'En cours' : 'Active'}</p>
                <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{language === 'fr' ? 'Retournées' : 'Returned'}</p>
                <p className="text-2xl font-bold text-green-600">{returnedCount}</p>
              </div>
              <span className="text-2xl text-green-400 opacity-60">✓</span>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold text-purple-600">{rentals.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: language === 'fr' ? `Toutes (${rentals.length})` : `All (${rentals.length})` },
            { key: 'active', label: language === 'fr' ? `En cours (${activeCount})` : `Active (${activeCount})` },
            { key: 'returned', label: language === 'fr' ? `Retournées (${returnedCount})` : `Returned (${returnedCount})` },
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key as any)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                filter === btn.key
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filteredRentals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {language === 'fr' ? 'Aucune location' : 'No rentals yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'fr'
                ? "Vous n'avez pas encore loué de produits."
                : "You haven't rented any products yet."}
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {language === 'fr' ? 'Parcourir le catalogue' : 'Browse catalog'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRentals.map((rental) => {
              const product = MOCK_PRODUCTS.find(p => p.id === rental.productId);
              const library = MOCK_LIBRAIRIES.find(l => l.id === rental.libraryId);
              const overdue = isOverdue(rental.endDate, rental.status);
              const daysLeft = getDaysRemaining(rental.endDate);
              const progress = getRentalProgress(rental.startDate, rental.endDate);
              const displayStatus = overdue ? 'overdue' : rental.status;

              return (
                <div
                  key={rental.id}
                  className={`bg-card rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${
                    overdue ? 'border-red-400' : 'border-border'
                  }`}
                >
                  {overdue && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">
                        {language === 'fr' ? 'Location en retard — veuillez retourner le produit' : 'Overdue — please return the product'}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-start gap-4">
                        {product && (
                          <div className="w-16 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            #{rental.id.replace('rental-', '').slice(0, 8).toUpperCase()}
                          </p>
                          <h3 className="font-bold text-lg">
                            {product?.title || language === 'fr' ? 'Produit inconnu' : 'Unknown product'}
                          </h3>
                          {product?.author && (
                            <p className="text-sm text-muted-foreground">{product.author}</p>
                          )}
                          {library && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{library.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(displayStatus)}`}>
                        {getStatusLabel(displayStatus)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {rental.status === 'active' && (
                      <div className="mb-5">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {language === 'fr' ? 'Progression' : 'Progress'}
                          </span>
                          <span className={`font-medium ${daysLeft <= 2 ? 'text-red-600' : 'text-primary'}`}>
                            {daysLeft} {language === 'fr' ? (daysLeft > 1 ? 'jours restants' : 'jour restant') : (daysLeft > 1 ? 'days left' : 'day left')}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progress >= 100 ? 'bg-red-500' : progress >= 80 ? 'bg-yellow-500' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'fr' ? 'Début' : 'Start'}
                        </p>
                        <p className="font-semibold text-sm">
                          {new Date(rental.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'fr' ? 'Fin prévue' : 'End date'}
                        </p>
                        <p className={`font-semibold text-sm ${overdue ? 'text-red-600' : ''}`}>
                          {new Date(rental.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'fr' ? 'Durée' : 'Duration'}
                        </p>
                        <p className="font-semibold text-sm">
                          {rental.days} {language === 'fr' ? (rental.days > 1 ? 'jours' : 'jour') : 'days'}
                        </p>
                      </div>
                    </div>

                    {rental.actualReturnDate && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-3">
                        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                        <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                          {language === 'fr' ? 'Retourné le' : 'Returned on'}{' '}
                          {new Date(rental.actualReturnDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="border-t border-border pt-4 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'fr' ? 'Total location' : 'Rental total'}
                        </p>
                        <p className="text-xl font-bold text-primary">{formatPrice(rental.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(rental.pricePerDay)}/{language === 'fr' ? 'j' : 'd'} × {rental.days}
                        </p>
                      </div>

                      {rental.status === 'active' && (
                        <button
                          onClick={() => handleRequestReturn(rental.id)}
                          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                          {language === 'fr' ? 'Marquer comme retourné' : 'Mark as returned'}
                        </button>
                      )}

                      {rental.status === 'pending_return' && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg px-4 py-2.5">
                          <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                            ⏳ {language === 'fr' ? 'En attente de validation librairie' : 'Awaiting library validation'}
                          </p>
                        </div>
                      )}

                      {rental.status === 'returned' && (
                        <button
                          onClick={() => navigate('/catalog')}
                          className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                        >
                          {language === 'fr' ? 'Louer à nouveau' : 'Rent again'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
