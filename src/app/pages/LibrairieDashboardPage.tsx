import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useLibraryProducts } from '../context/LibraryProductsContext';
import { useLibraryOrders } from '../context/LibraryOrdersContext';
import { useLibraryRentals } from '../context/LibraryRentalsContext';
import { useWallet } from '../context/WalletContext';
import { useNotifications } from '../context/NotificationsContext';
import {
  Package, ShoppingBag, Wallet, TrendingUp, Plus, AlertTriangle,
  Clock, CheckCircle, FileText, Star, ArrowRight, Bell,
  ToggleRight, Calendar, BarChart3
} from 'lucide-react';

export function LibrairieDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, formatPrice } = useLocalization();
  const { libraryProducts } = useLibraryProducts();
  const { getLibraryOrders } = useLibraryOrders();
  const { getLibraryRentals } = useLibraryRentals();
  const { wallet } = useWallet();
  const { unreadCount } = useNotifications();

  const fr = language === 'fr';
  const libraryId = user?.id || 'lib-1';

  const myProducts = libraryProducts.filter(p => p.librarieId === libraryId);
  const activeProducts = myProducts.filter(p => p.active);
  const lowStock = myProducts.filter(p => p.active && p.stock > 0 && p.stock <= 5);
  const outOfStock = myProducts.filter(p => p.active && p.stock === 0);
  const digitalProducts = myProducts.filter(p => p.active && (p.digitalPrice || 0) > 0);

  const orders = getLibraryOrders(libraryId);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing' || o.status === 'confirmed' || o.status === 'shipped');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const revenueOrders = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0);

  const rentals = getLibraryRentals(libraryId);
  const activeRentals = rentals.filter(r => r.status === 'active');
  const overdueRentals = rentals.filter(r => {
    if (r.status === 'returned') return false;
    return new Date(r.endDate) < new Date();
  });

  const now = new Date();
  const thisMonth = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const revenueThisMonth = thisMonth
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.totalAmount, 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topProducts = [...myProducts]
    .filter(p => p.active && p.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };

  const statusLabel: Record<string, { fr: string; en: string }> = {
    pending: { fr: 'En attente', en: 'Pending' },
    confirmed: { fr: 'Confirmée', en: 'Confirmed' },
    processing: { fr: 'En préparation', en: 'Processing' },
    shipped: { fr: 'Expédiée', en: 'Shipped' },
    delivered: { fr: 'Livrée', en: 'Delivered' },
    cancelled: { fr: 'Annulée', en: 'Cancelled' },
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {fr ? `Bonjour, ${user?.name?.split(' ')[0]} 👋` : `Hello, ${user?.name?.split(' ')[0]} 👋`}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {fr ? 'Vue d\'ensemble de votre librairie' : 'Overview of your library'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/librairie/notifications')}
              className="relative p-2.5 bg-card border border-border rounded-xl hover:border-orange-400 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/librairie/products/new')}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {fr ? 'Ajouter un produit' : 'Add Product'}
            </button>
          </div>
        </div>

        {/* Alertes urgentes */}
        {(pendingOrders.length > 0 || overdueRentals.length > 0 || outOfStock.length > 0) && (
          <div className="space-y-2">
            {pendingOrders.length > 0 && (
              <button
                onClick={() => navigate('/librairie/orders')}
                className="w-full flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl text-left hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex-1">
                  {pendingOrders.length} {fr ? 'commande(s) en attente de traitement' : 'order(s) awaiting processing'}
                </p>
                <ArrowRight className="w-4 h-4 text-yellow-600" />
              </button>
            )}
            {overdueRentals.length > 0 && (
              <button
                onClick={() => navigate('/librairie/rentals')}
                className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl text-left hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm font-medium text-red-800 dark:text-red-200 flex-1">
                  {overdueRentals.length} {fr ? 'location(s) en retard de retour' : 'rental(s) overdue for return'}
                </p>
                <ArrowRight className="w-4 h-4 text-red-600" />
              </button>
            )}
            {outOfStock.length > 0 && (
              <button
                onClick={() => navigate('/librairie/inventory')}
                className="w-full flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-xl text-left hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <Package className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200 flex-1">
                  {outOfStock.length} {fr ? 'produit(s) en rupture de stock' : 'product(s) out of stock'}
                </p>
                <ArrowRight className="w-4 h-4 text-orange-600" />
              </button>
            )}
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Solde */}
          <div
            onClick={() => navigate('/librairie/wallet')}
            className="col-span-2 lg:col-span-1 bg-green-50 dark:bg-green-950/20 rounded-xl p-5 text-white shadow cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">{fr ? 'Solde portefeuille' : 'Wallet Balance'}</span>
              <Wallet className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(wallet?.balance || 0)}</p>
            <p className="text-xs opacity-75 mt-1 flex items-center gap-1">
              {fr ? 'Voir le portefeuille' : 'View wallet'} <ArrowRight className="w-3 h-3" />
            </p>
          </div>

          <div
            onClick={() => navigate('/librairie/sales')}
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-orange-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{fr ? 'CA ce mois' : 'Revenue this month'}</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(revenueThisMonth)}</p>
            <p className="text-xs text-muted-foreground mt-1">{thisMonth.filter(o => o.status === 'delivered').length} {fr ? 'ventes' : 'sales'}</p>
          </div>

          <div
            onClick={() => navigate('/librairie/orders')}
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-orange-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{fr ? 'Commandes reçues' : 'Orders Received'}</span>
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingOrders.length > 0
                ? <span className="text-yellow-600 font-medium">{pendingOrders.length} {fr ? 'en attente' : 'pending'}</span>
                : (fr ? 'toutes traitées' : 'all handled')}
            </p>
          </div>

          <div
            onClick={() => navigate('/librairie/products')}
            className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-orange-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{fr ? 'Produits actifs' : 'Active Products'}</span>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{activeProducts.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStock.length > 0
                ? <span className="text-orange-500 font-medium">{lowStock.length} {fr ? 'stock faible' : 'low stock'}</span>
                : (fr ? `sur ${myProducts.length} total` : `of ${myProducts.length} total`)}
            </p>
          </div>
        </div>

        {/* Second row KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => navigate('/librairie/rentals')}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{activeRentals.length}</p>
                <p className="text-xs text-muted-foreground">{fr ? 'Locations actives' : 'Active rentals'}</p>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/librairie/digital-products')}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{digitalProducts.length}</p>
                <p className="text-xs text-muted-foreground">{fr ? 'Produits PDF' : 'PDF Products'}</p>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/librairie/statistics')}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{deliveredOrders.length}</p>
                <p className="text-xs text-muted-foreground">{fr ? 'Ventes totales' : 'Total sales'}</p>
              </div>
            </div>
          </div>

          <div onClick={() => navigate('/librairie/inventory')}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                outOfStock.length > 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'
              }`}>
                <ToggleRight className={`w-5 h-5 ${outOfStock.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${outOfStock.length > 0 ? 'text-red-600' : ''}`}>{outOfStock.length}</p>
                <p className="text-xs text-muted-foreground">{fr ? 'Ruptures de stock' : 'Out of stock'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Commandes récentes */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                {fr ? 'Commandes récentes' : 'Recent Orders'}
              </h2>
              <button
                onClick={() => navigate('/librairie/orders')}
                className="text-sm text-orange-600 hover:underline flex items-center gap-1"
              >
                {fr ? 'Voir tout' : 'See all'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{fr ? 'Aucune commande pour le moment' : 'No orders yet'}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium">#{order.id.replace('order-', '')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status] || 'bg-muted text-muted-foreground'}`}>
                          {fr ? statusLabel[order.status]?.fr : statusLabel[order.status]?.en}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {order.shippingAddress?.name || '—'} · {order.items.length} {fr ? 'article(s)' : 'item(s)'}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-sm">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(fr ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Produits mieux notés */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {fr ? 'Mieux notés' : 'Top Rated'}
                </h3>
                <button onClick={() => navigate('/librairie/products')} className="text-xs text-orange-600 hover:underline">
                  {fr ? 'Voir tout' : 'See all'}
                </button>
              </div>
              {topProducts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {fr ? 'Pas encore de note' : 'No ratings yet'}
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {topProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60'}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{p.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({p.reviewsCount})</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-600">{formatPrice(p.salePrice || 0)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Raccourcis */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">{fr ? 'Accès rapide' : 'Quick Access'}</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: fr ? 'Ajouter produit' : 'Add Product', icon: Plus, path: '/librairie/products/new', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
                  { label: fr ? 'Commandes' : 'Orders', icon: ShoppingBag, path: '/librairie/orders', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                  { label: fr ? 'Stock' : 'Stock', icon: Package, path: '/librairie/inventory', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                  { label: fr ? 'Portefeuille' : 'Wallet', icon: Wallet, path: '/librairie/wallet', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${item.color} hover:opacity-80 transition-opacity`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statut commandes (mini) */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                {fr ? 'Statut commandes' : 'Order Status'}
              </h3>
              <div className="space-y-2">
                {[
                  { label: fr ? 'En attente' : 'Pending', count: pendingOrders.length, color: 'bg-yellow-500' },
                  { label: fr ? 'En cours' : 'Processing', count: processingOrders.length, color: 'bg-blue-500' },
                  { label: fr ? 'Livrées' : 'Delivered', count: deliveredOrders.length, color: 'bg-green-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-xs flex-1">{s.label}</span>
                    <span className="text-xs font-bold">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
