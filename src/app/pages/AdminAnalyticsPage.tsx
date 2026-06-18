import { useState } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Jan', ventes: 45000, locations: 12000 },
  { name: 'Fév', ventes: 52000, locations: 15000 },
  { name: 'Mar', ventes: 48000, locations: 13500 },
  { name: 'Avr', ventes: 61000, locations: 18000 },
  { name: 'Mai', ventes: 55000, locations: 16500 },
  { name: 'Juin', ventes: 67000, locations: 20000 },
];

const categoryData = [
  { name: 'Romans', value: 35 },
  { name: 'Sciences', value: 25 },
  { name: 'Jeunesse', value: 20 },
  { name: 'Essais', value: 12 },
  { name: 'Autres', value: 8 },
];

const COLORS = ['#0D1B3E', '#F97316', '#10B981', '#3B82F6', '#8B5CF6'];

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Statistiques Globales</h1>
                <p className="text-sm text-muted-foreground">
                  Analysez les performances de la plateforme
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    period === p
                      ? 'bg-purple-500 text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenus Totaux</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">87 000 FCFA</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Commandes</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">234</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Utilisateurs</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,234</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +15% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Produits</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">5,678</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +5% ce mois
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-card rounded-xl border border-border p-6 animate-slide-in-left">
            <h3 className="font-semibold text-lg mb-4">Revenus</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" />
                <XAxis key="xaxis" dataKey="name" />
                <YAxis key="yaxis" />
                <Tooltip key="tooltip" />
                <Legend key="legend" />
                <Line
                  key="ventes-line"
                  type="monotone"
                  dataKey="ventes"
                  stroke="#0D1B3E"
                  strokeWidth={2}
                  name="Ventes"
                />
                <Line
                  key="locations-line"
                  type="monotone"
                  dataKey="locations"
                  stroke="#F97316"
                  strokeWidth={2}
                  name="Locations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-card rounded-xl border border-border p-6 animate-slide-in-right">
            <h3 className="font-semibold text-lg mb-4">Répartition par Catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  key="category-pie"
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`pie-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip key="pie-tooltip" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h3 className="font-semibold text-lg mb-4">Activité Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid key="bar-grid" strokeDasharray="3 3" />
              <XAxis key="bar-xaxis" dataKey="name" />
              <YAxis key="bar-yaxis" />
              <Tooltip key="bar-tooltip" />
              <Legend key="bar-legend" />
              <Bar key="ventes-bar" dataKey="ventes" fill="#0D1B3E" name="Ventes" />
              <Bar key="locations-bar" dataKey="locations" fill="#F97316" name="Locations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
