import { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { ShoppingBag, Package, Truck, CheckCircle, Clock, XCircle, Calendar, MapPin } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useLibraryOrders } from '../context/LibraryOrdersContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationsContext';

export function LibrairieOrdersPage() {
  const { formatPrice } = useLocalization();
  const { user } = useAuth();
  const { orders, getLibraryOrders, updateOrderStatus } = useLibraryOrders();
  const { creditWallet } = useWallet();
  const { addNotification } = useNotifications();

  const libraryId = user?.id || 'lib-1';
  const libraryOrders = getLibraryOrders(libraryId);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any, {
      onWalletCredit: (amount, desc, meta) => creditWallet(amount, desc, meta),
      onNotify: (notif) => addNotification(notif),
    });
  };

  const filteredOrders = filterStatus === 'all'
    ? libraryOrders
    : libraryOrders.filter(o => o.status === filterStatus);

  const totalOrders = libraryOrders.length;
  const pendingOrders = libraryOrders.filter(o => o.status === 'pending').length;
  const processingOrders = libraryOrders.filter(o => o.status === 'processing' || o.status === 'confirmed').length;
  const deliveredOrders = libraryOrders.filter(o => o.status === 'delivered').length;
  const totalRevenue = libraryOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Commandes Reçues</h1>
              <p className="text-sm text-muted-foreground">
                Gérez et suivez toutes vos commandes
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En Traitement</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{processingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenu ({deliveredOrders} livrées)</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 animate-slide-in-left">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {status === 'all' ? 'Toutes' : getStatusLabel(status)}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({libraryOrders.filter(o => o.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4 animate-fade-in">
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);

            return (
              <div
                key={order.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Commande #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => {
                      const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                      return (
                        <div key={idx} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                            <img
                              src={product?.images[0] || item.image || 'https://via.placeholder.com/80'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price * item.quantity)} total
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer & Delivery Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">Adresse de livraison</p>
                          <p className="text-muted-foreground">{order.shippingAddress.name}</p>
                          <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                          <p className="text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">Paiement</p>
                          <p className={`${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'} font-medium`}>
                            {order.paymentStatus === 'paid' ? '✓ Payé' : '⏱ En attente'}
                          </p>
                          {order.paymentMethod && (
                            <p className="text-muted-foreground">{order.paymentMethod}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Montant total</p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                    </div>

                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Confirmer
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'processing')}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                          >
                            Préparer
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                          >
                            Expédier
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Marquer comme livrée
                          </button>
                        )}
                      </div>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Portefeuille crédité
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Aucune commande</h2>
            <p className="text-muted-foreground">
              {filterStatus === 'all'
                ? "Vous n'avez pas encore reçu de commandes"
                : `Aucune commande avec le statut "${getStatusLabel(filterStatus)}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
