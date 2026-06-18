import { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Package,
  Users, Star, Calendar, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export function LibrairieStatisticsPage() {
  const { formatPrice } = useLocalization();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock statistics data
  const stats = [
    {
      label: 'Revenu Total',
      value: formatPrice(15750000),
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'bg-green-600'
    },
    {
      label: 'Bénéfice Brut',
      value: formatPrice(5050000),
      change: '+18.4%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-emerald-600'
    },
    {
      label: 'Commandes',
      value: '432',
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingBag,
      color: 'bg-blue-600'
    },
    {
      label: 'Produits Vendus',
      value: '1,245',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Package,
      color: 'bg-purple-600'
    },
    {
      label: 'Clients',
      value: '289',
      change: '+6.1%',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-orange-600'
    },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 8500000, profit: 2550000, orders: 145 },
    { name: 'Fév', revenue: 9200000, profit: 2860000, orders: 168 },
    { name: 'Mar', revenue: 11000000, profit: 3520000, orders: 192 },
    { name: 'Avr', revenue: 10500000, profit: 3310000, orders: 175 },
    { name: 'Mai', revenue: 13200000, profit: 4280000, orders: 215 },
    { name: 'Jun', revenue: 15750000, profit: 5050000, orders: 248 },
  ];

  const categoryData = [
    { name: 'Livres', value: 45, color: '#3b82f6' },
    { name: 'Manuels', value: 25, color: '#8b5cf6' },
    { name: 'Fournitures', value: 20, color: '#f97316' },
    { name: 'Autres', value: 10, color: '#10b981' },
  ];

  const topProducts = [
    { name: 'Munyal : Les Larmes de la Patience', sales: 87, revenue: 1087500, profit: 391500 },
    { name: 'Cahier Oxford A4 - 96 pages', sales: 156, revenue: 390000, profit: 140400 },
    { name: 'Manuel de Mathématiques Terminale C', sales: 45, revenue: 675000, profit: 216000 },
    { name: 'Pack 10 Stylos BIC', sales: 234, revenue: 468000, profit: 163800 },
    { name: 'Calculatrice Scientifique Casio', sales: 34, revenue: 850000, profit: 272000 },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Statistiques</h1>
              <p className="text-muted-foreground">
                Analyse des performances de votre librairie
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 bg-muted rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    period === p
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted-foreground/10'
                  }`}
                >
                  {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-primary ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Évolution du revenu et du bénéfice</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid key="revenue-grid" strokeDasharray="3 3" />
                <XAxis key="revenue-xaxis" dataKey="name" />
                <YAxis key="revenue-yaxis" />
                <Tooltip key="revenue-tooltip" />
                <Legend key="revenue-legend" />
                <Line
                  key="revenue-line"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0D1B3E"
                  strokeWidth={2}
                  name="Revenu (XAF)"
                />
                <Line
                  key="profit-line"
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Bénéfice (XAF)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Ventes par Catégorie</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  key="category-pie"
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="category-tooltip" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Commandes par Mois</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid key="orders-grid" strokeDasharray="3 3" />
              <XAxis key="orders-xaxis" dataKey="name" />
              <YAxis key="orders-yaxis" />
              <Tooltip key="orders-tooltip" />
              <Legend key="orders-legend" />
              <Bar
                key="orders-bar"
                dataKey="orders"
                fill="#f97316"
                name="Commandes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Top 5 Produits</h2>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} ventes
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(product.revenue)}</p>
                  <p className="text-xs text-muted-foreground">Revenu</p>
                  <p className="font-semibold text-emerald-600">{formatPrice(product.profit)}</p>
                  <p className="text-xs text-muted-foreground">Bénéfice</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
