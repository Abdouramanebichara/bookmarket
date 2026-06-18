import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useOrders, Order } from '../context/OrdersContext';
import {
  Package, Calendar, MapPin, CreditCard, Truck, CheckCircle,
  Clock, TrendingUp, X, FileText, ShoppingBag, Tag
} from 'lucide-react';

export function OrdersPage() {
  const navigate = useNavigate();
  const { formatPrice, language } = useLocalization();
  const { orders } = useOrders();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: language === 'fr' ? 'En attente' : 'Pending',
      confirmed: language === 'fr' ? 'Confirmée' : 'Confirmed',
      processing: language === 'fr' ? 'En préparation' : 'Processing',
      shipped: language === 'fr' ? 'Expédiée' : 'Shipped',
      delivered: language === 'fr' ? 'Livrée' : 'Delivered',
      cancelled: language === 'fr' ? 'Annulée' : 'Cancelled',
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status);
    if (filter === 'confirmed') return order.status === 'delivered';
    return true;
  });

  const inProgressCount = orders.filter(o =>
    ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)
  ).length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'fr' ? 'Mes Commandes' : 'My Orders'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Suivez vos commandes en temps réel' : 'Track your orders in real time'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'fr' ? 'En cours' : 'In progress'}
                </p>
                <p className="text-2xl font-bold text-orange-600">{inProgressCount}</p>
              </div>
              <Truck className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'fr' ? 'Livrées' : 'Delivered'}
                </p>
                <p className="text-2xl font-bold text-green-600">{deliveredCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400 opacity-60" />
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'fr' ? 'Total' : 'Total'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: language === 'fr' ? `Toutes (${orders.length})` : `All (${orders.length})` },
            { key: 'pending', label: language === 'fr' ? `En cours (${inProgressCount})` : `In progress (${inProgressCount})` },
            { key: 'confirmed', label: language === 'fr' ? `Livrées (${deliveredCount})` : `Delivered (${deliveredCount})` },
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

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {language === 'fr' ? 'Aucune commande' : 'No orders yet'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'fr'
                ? "Vous n'avez pas encore passé de commande."
                : "You haven't placed any orders yet."}
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
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono text-muted-foreground">
                          #{order.id.replace('order-', '').slice(0, 10).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-muted/30 rounded-lg p-2 pr-4">
                        <div className="w-12 h-14 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1 max-w-[140px]">{item.title}</p>
                          <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                          <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border pt-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'fr' ? 'Total commande' : 'Order total'}
                      </p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      {language === 'fr' ? 'Voir les détails' : 'View details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {language === 'fr' ? 'Détails de la commande' : 'Order Details'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  #{selectedOrder.id.replace('order-', '').slice(0, 10).toUpperCase()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status & Date */}
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'fr' ? 'Date de commande' : 'Order date'}
                  </p>
                  <p className="font-medium">
                    {new Date(selectedOrder.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">
                  {language === 'fr' ? 'Articles' : 'Items'} ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.mode === 'sale' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : item.mode === 'digital' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {item.mode === 'sale' ? <><Package className="w-3 h-3" />{language === 'fr' ? 'Achat' : 'Purchase'}</>
                            : item.mode === 'digital' ? <><FileText className="w-3 h-3" />PDF</>
                            : <><Tag className="w-3 h-3" />{language === 'fr' ? 'Location' : 'Rental'}</>}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-muted-foreground">×{item.quantity}</p>
                          <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'fr' ? 'Livraison' : 'Shipping'}</span>
                  <span>{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Payment & Address */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <p className="font-medium text-sm">
                      {language === 'fr' ? 'Paiement' : 'Payment'}
                    </p>
                  </div>
                  <p className="text-sm text-green-600 font-medium">✓ {language === 'fr' ? 'Payé' : 'Paid'}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.paymentMethod}</p>
                </div>
                {selectedOrder.shippingAddress && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <p className="font-medium text-sm">
                        {language === 'fr' ? 'Livraison' : 'Delivery'}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
