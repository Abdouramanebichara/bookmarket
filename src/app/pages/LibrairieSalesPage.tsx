import { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockData';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useLibraryProducts } from '../context/LibraryProductsContext';
import { useLibraryOrders } from '../context/LibraryOrdersContext';
import {
  TrendingUp, ShoppingBag, Package, DollarSign, Calendar,
  Search, Filter, Download, ArrowUpRight, ChevronDown, ChevronUp, Eye
} from 'lucide-react';

type Period = 'today' | 'week' | 'month' | 'year' | 'all';
type SortField = 'date' | 'amount' | 'items';

export function LibrairieSalesPage() {
  const { formatPrice, language } = useLocalization();
  const { user } = useAuth();
  const { libraryProducts } = useLibraryProducts();
  const { getLibraryOrders } = useLibraryOrders();

  const libraryId = user?.id || 'lib-1';
  const allOrders = getLibraryOrders(libraryId);

  const [period, setPeriod] = useState<Period>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Period filter
  const now = new Date();
  const filteredByPeriod = useMemo(() => {
    return allOrders.filter(o => {
      const d = new Date(o.createdAt);
      if (period === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (period === 'week') {
        const diff = (now.getTime() - d.getTime()) / 86400000;
        return diff <= 7;
      }
      if (period === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (period === 'year') {
        return d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [allOrders, period]);

  const filteredOrders = useMemo(() => {
    let result = filteredByPeriod.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });

    result = [...result].sort((a, b) => {
      let va: number, vb: number;
      if (sortField === 'date') {
        va = new Date(a.createdAt).getTime();
        vb = new Date(b.createdAt).getTime();
      } else if (sortField === 'amount') {
        va = a.totalAmount; vb = b.totalAmount;
      } else {
        va = a.items.reduce((s, i) => s + i.quantity, 0);
        vb = b.items.reduce((s, i) => s + i.quantity, 0);
      }
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    return result;
  }, [filteredByPeriod, searchQuery, statusFilter, sortField, sortDir]);

  // Stats
  const deliveredOrders = filteredByPeriod.filter(o => o.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0);
  const totalUnitsSold = deliveredOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);
  const avgOrderValue = deliveredOrders.length ? totalRevenue / deliveredOrders.length : 0;
  const pendingRevenue = filteredByPeriod
    .filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing' || o.status === 'shipped')
    .reduce((s, o) => s + o.totalAmount, 0);

  // Top products
  const productSales: Record<string, { title: string; qty: number; revenue: number }> = {};
  deliveredOrders.forEach(o => {
    o.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { title: item.title, qty: 0, revenue: 0 };
      }
      productSales[item.productId].qty += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, { fr: string; en: string; cls: string }> = {
      pending: { fr: 'En attente', en: 'Pending', cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
      confirmed: { fr: 'Confirmée', en: 'Confirmed', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
      processing: { fr: 'En préparation', en: 'Processing', cls: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
      shipped: { fr: 'Expédiée', en: 'Shipped', cls: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
      delivered: { fr: 'Livrée', en: 'Delivered', cls: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
      cancelled: { fr: 'Annulée', en: 'Cancelled', cls: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
    };
    const s = map[status] || { fr: status, en: status, cls: 'bg-muted text-muted-foreground' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>{language === 'fr' ? s.fr : s.en}</span>;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === 'desc'
      ? <ChevronDown className="w-3.5 h-3.5 text-orange-600" />
      : <ChevronUp className="w-3.5 h-3.5 text-orange-600" />;
  };

  const PERIODS: { val: Period; fr: string; en: string }[] = [
    { val: 'today', fr: "Aujourd'hui", en: 'Today' },
    { val: 'week', fr: '7 derniers jours', en: 'Last 7 days' },
    { val: 'month', fr: 'Ce mois', en: 'This month' },
    { val: 'year', fr: 'Cette année', en: 'This year' },
    { val: 'all', fr: 'Tout', en: 'All time' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{language === 'fr' ? 'Mes Ventes' : 'My Sales'}</h1>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Historique et analyse de vos ventes' : 'Sales history and analytics'}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            {language === 'fr' ? 'Exporter' : 'Export'}
          </button>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {PERIODS.map(p => (
            <button
              key={p.val}
              onClick={() => setPeriod(p.val)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                period === p.val
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-card border border-border hover:border-orange-400 hover:text-orange-600'
              }`}
            >
              {language === 'fr' ? p.fr : p.en}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-5 text-white shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm opacity-90">{language === 'fr' ? 'Chiffre d\'affaires' : 'Revenue'}</span>
              <DollarSign className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
            <p className="text-xs opacity-75 mt-1">{language === 'fr' ? 'Commandes livrées' : 'Delivered orders'}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{language === 'fr' ? 'Commandes' : 'Orders'}</span>
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{deliveredOrders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{language === 'fr' ? 'livrées' : 'delivered'}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{language === 'fr' ? 'Unités vendues' : 'Units Sold'}</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{totalUnitsSold}</p>
            <p className="text-xs text-muted-foreground mt-1">{language === 'fr' ? 'articles' : 'items'}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{language === 'fr' ? 'Panier moyen' : 'Avg. Order'}</span>
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(Math.round(avgOrderValue))}</p>
            <p className="text-xs text-muted-foreground mt-1">{language === 'fr' ? 'par commande' : 'per order'}</p>
          </div>
        </div>

        {pendingRevenue > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {language === 'fr'
                ? `${formatPrice(pendingRevenue)} en attente de livraison (commandes en cours)`
                : `${formatPrice(pendingRevenue)} pending delivery (orders in progress)`}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Orders Table */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Filters */}
              <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? 'Chercher commande, produit...' : 'Search order, product...'}
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="all">{language === 'fr' ? 'Tous statuts' : 'All statuses'}</option>
                  <option value="pending">{language === 'fr' ? 'En attente' : 'Pending'}</option>
                  <option value="delivered">{language === 'fr' ? 'Livrée' : 'Delivered'}</option>
                  <option value="shipped">{language === 'fr' ? 'Expédiée' : 'Shipped'}</option>
                  <option value="cancelled">{language === 'fr' ? 'Annulée' : 'Cancelled'}</option>
                </select>
              </div>

              {/* Table head */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="col-span-3">{language === 'fr' ? 'Commande' : 'Order'}</div>
                <div className="col-span-3 cursor-pointer flex items-center gap-1" onClick={() => handleSort('date')}>
                  {language === 'fr' ? 'Date' : 'Date'} <SortIcon field="date" />
                </div>
                <div className="col-span-2 cursor-pointer flex items-center gap-1" onClick={() => handleSort('items')}>
                  {language === 'fr' ? 'Qtés' : 'Qty'} <SortIcon field="items" />
                </div>
                <div className="col-span-2 cursor-pointer flex items-center gap-1" onClick={() => handleSort('amount')}>
                  {language === 'fr' ? 'Montant' : 'Amount'} <SortIcon field="amount" />
                </div>
                <div className="col-span-2">{language === 'fr' ? 'Statut' : 'Status'}</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      {language === 'fr' ? 'Aucune vente pour cette période' : 'No sales for this period'}
                    </p>
                  </div>
                ) : filteredOrders.map(order => {
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <div key={order.id}>
                      <div
                        className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer items-center"
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="col-span-3">
                          <p className="text-sm font-medium">#{order.id.replace('order-', '')}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.shippingAddress?.name || '—'}</p>
                        </div>
                        <div className="col-span-3">
                          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm">{order.items.reduce((s, i) => s + i.quantity, 0)} art.</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-bold">{formatPrice(order.totalAmount)}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          {getStatusLabel(order.status)}
                          <Eye className={`w-4 h-4 ml-1 transition-colors ${isExpanded ? 'text-orange-600' : 'text-muted-foreground'}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 bg-muted/20 border-t border-border">
                          <div className="pt-3 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                              {language === 'fr' ? 'Détail des articles' : 'Order items'}
                            </p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                                <span className="truncate flex-1">{item.title}</span>
                                <span className="mx-4 text-muted-foreground">× {item.quantity}</span>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            {order.deliveryAddress && (
                              <p className="text-xs text-muted-foreground pt-1">
                                📍 {order.deliveryAddress}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredOrders.length > 0 && (
                <div className="px-4 py-3 border-t border-border bg-muted/30 flex justify-between text-sm">
                  <span className="text-muted-foreground">{filteredOrders.length} {language === 'fr' ? 'commande(s)' : 'order(s)'}</span>
                  <span className="font-bold">
                    {language === 'fr' ? 'Total livré:' : 'Delivered total:'} {formatPrice(filteredOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Top Products */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                {language === 'fr' ? 'Produits les + vendus' : 'Top Selling Products'}
              </h3>
              {topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {language === 'fr' ? 'Aucune vente pour cette période' : 'No sales for this period'}
                </p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map(([productId, data], idx) => {
                    const product = MOCK_PRODUCTS.find(p => p.id === productId) || libraryProducts.find(p => p.id === productId);
                    return (
                      <div key={productId} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                          idx === 1 ? 'bg-gray-100 text-gray-600' :
                          idx === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-muted text-muted-foreground'
                        }`}>{idx + 1}</span>
                        {product?.images?.[0] && (
                          <img src={product.images[0]} alt="" className="w-8 h-8 object-cover rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{data.title}</p>
                          <p className="text-xs text-muted-foreground">{data.qty} {language === 'fr' ? 'vendu(s)' : 'sold'}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600 flex-shrink-0">{formatPrice(data.revenue)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Category breakdown */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-600" />
                {language === 'fr' ? 'Par catégorie' : 'By Category'}
              </h3>
              {(() => {
                const catSales: Record<string, number> = {};
                deliveredOrders.forEach(o => {
                  o.items.forEach(item => {
                    const p = MOCK_PRODUCTS.find(pr => pr.id === item.productId);
                    const catId = p?.categoryId || 'other';
                    catSales[catId] = (catSales[catId] || 0) + item.price * item.quantity;
                  });
                });
                const sorted = Object.entries(catSales).sort((a, b) => b[1] - a[1]).slice(0, 4);
                const total = sorted.reduce((s, [, v]) => s + v, 0);
                if (sorted.length === 0) return (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {language === 'fr' ? 'Aucune donnée' : 'No data'}
                  </p>
                );
                return (
                  <div className="space-y-3">
                    {sorted.map(([catId, revenue]) => {
                      const cat = CATEGORIES.find(c => c.id === catId);
                      const pct = total ? Math.round((revenue / total) * 100) : 0;
                      return (
                        <div key={catId}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="truncate">{cat?.name || catId}</span>
                            <span className="font-medium ml-2">{pct}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
