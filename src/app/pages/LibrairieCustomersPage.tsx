import { useState } from 'react';
import { MOCK_CLIENTS, MOCK_ORDERS, MOCK_RENTALS } from '../data/mockData';
import { Users, ShoppingBag, Calendar, TrendingUp, Mail, Phone, MapPin, Search, Star } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';

export function LibrairieCustomersPage() {
  const { formatPrice } = useLocalization();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'spent'>('name');

  // Get customers who have ordered from this library (lib-1)
  const libraryOrders = MOCK_ORDERS.filter(o => o.librarieId === 'lib-1');
  const libraryRentals = MOCK_RENTALS.filter(r => r.librarieId === 'lib-1');

  const customerIds = new Set([
    ...libraryOrders.map(o => o.userId),
    ...libraryRentals.map(r => r.userId)
  ]);

  const customers = MOCK_CLIENTS.filter(c => customerIds.has(c.id)).map(customer => {
    const orders = libraryOrders.filter(o => o.userId === customer.id);
    const rentals = libraryRentals.filter(r => r.userId === customer.id);
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0) +
                      rentals.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalOrders = orders.length + rentals.length;

    return {
      ...customer,
      totalOrders,
      totalSpent,
      lastOrderDate: orders.length > 0
        ? new Date(Math.max(...orders.map(o => new Date(o.createdAt).getTime())))
        : rentals.length > 0
        ? new Date(Math.max(...rentals.map(r => new Date(r.createdAt).getTime())))
        : null,
    };
  });

  // Filter and sort
  let filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredCustomers.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
    if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
    return 0;
  });

  // Calculate stats
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestion des Clients</h1>
              <p className="text-sm text-muted-foreground">
                Suivez et gérez votre base de clients fidèles
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Clients</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenu Total</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Panier Moyen</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatPrice(avgOrderValue || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Top Client</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {topCustomers[0]?.totalOrders || 0}
                </p>
                <p className="text-xs text-muted-foreground">commandes</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6 animate-slide-in-left">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Top 5 Clients
          </h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatPrice(customer.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">{customer.totalOrders} commandes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nom, email..."
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="name">Nom (A-Z)</option>
                <option value="orders">Nombre de commandes</option>
                <option value="spent">Montant dépensé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">
              {filteredCustomers.length} client{filteredCustomers.length > 1 ? 's' : ''}
            </h3>
          </div>

          <div className="divide-y divide-border">
            {filteredCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="p-6 hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{customer.name}</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {customer.city && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{customer.city}, {customer.country}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-primary">{formatPrice(customer.totalSpent)}</p>
                      <p className="text-xs text-muted-foreground">Total dépensé</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{customer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Commandes</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })
                        : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">Dernière commande</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">
                      {formatPrice(customer.totalSpent / customer.totalOrders || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Panier moyen</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun client trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
