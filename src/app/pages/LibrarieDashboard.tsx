import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useWallet } from '../context/WalletContext';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../data/mockData';
import {
  DollarSign, Package, ShoppingBag, TrendingUp, AlertCircle,
  Plus, Wallet, FileText, Clock, CheckCircle, ArrowUpRight,
  Star, Box
} from 'lucide-react';

export function LibrarieDashboard() {
  const navigate = useNavigate();
  const { formatPrice, language } = useLocalization();
  const { wallet, transactions } = useWallet();

  // Mock data for librairie
  const libraryProducts = MOCK_PRODUCTS.slice(0, 10);
  const libraryOrders = MOCK_ORDERS.slice(0, 8);
  const pendingOrders = libraryOrders.filter(o => o.status === 'pending').length;
  const completedToday = 3;
  const outOfStock = libraryProducts.filter(p => p.stock === 0).length;

  const todaySales = 125000;
  const recentRevenue = 450000;

  // Best selling products
  const bestSellers = libraryProducts.slice(0, 5);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Gérez votre librairie et suivez vos performances' : 'Manage your bookstore and track performance'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Wallet Card */}
          <div
            onClick={() => navigate('/librairie/wallet')}
            className="bg-green-50 dark:bg-green-950/20 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-6 h-6 opacity-90" />
              <ArrowUpRight className="w-4 h-4 opacity-90" />
            </div>
            <div className="text-2xl font-bold mb-1">{wallet ? formatPrice(wallet.balance) : formatPrice(0)}</div>
            <div className="text-sm opacity-90">
              {language === 'fr' ? 'Solde Wallet' : 'Wallet Balance'}
            </div>
          </div>

          {/* Sales Today */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold mb-1">{formatPrice(todaySales)}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Ventes du jour' : 'Sales Today'}
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold mb-1">{pendingOrders}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Commandes en attente' : 'Pending Orders'}
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold mb-1">{outOfStock}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Produits en rupture' : 'Out of Stock'}
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold mb-1">{libraryProducts.length}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Produits actifs' : 'Active Products'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {language === 'fr' ? 'Actions rapides' : 'Quick Actions'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={() => navigate('/librairie/products/new')}
              className="bg-orange-600 text-white rounded-xl p-4 hover:bg-orange-700 transition-all text-left group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">
                    {language === 'fr' ? 'Ajouter Produit' : 'Add Product'}
                  </p>
                  <p className="text-xs opacity-90">
                    {language === 'fr' ? 'Nouveau produit' : 'New product'}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/librairie/inventory')}
              className="bg-card rounded-xl p-4 border border-border hover:border-orange-600 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Box className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">
                    {language === 'fr' ? 'Ajouter Stock' : 'Add Stock'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr' ? 'Gérer inventaire' : 'Manage inventory'}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/librairie/orders')}
              className="bg-card rounded-xl p-4 border border-border hover:border-orange-600 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">
                    {language === 'fr' ? 'Voir Commandes' : 'View Orders'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pendingOrders} {language === 'fr' ? 'en attente' : 'pending'}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/librairie/wallet')}
              className="bg-card rounded-xl p-4 border border-border hover:border-orange-600 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">
                    {language === 'fr' ? 'Voir Wallet' : 'View Wallet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr' ? 'Gérer finances' : 'Manage finances'}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/librairie/digital-products')}
              className="bg-card rounded-xl p-4 border border-border hover:border-orange-600 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold">
                    {language === 'fr' ? 'Ajouter PDF' : 'Add PDF'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr' ? 'Version numérique' : 'Digital version'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold mb-4">
              {language === 'fr' ? 'Dernières commandes reçues' : 'Recent Orders Received'}
            </h3>
            <div className="space-y-3">
              {libraryOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate('/librairie/orders')}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {language === 'fr' ? 'Commande' : 'Order'} #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatPrice(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'pending'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20'
                    }`}>
                      {order.status === 'pending'
                        ? (language === 'fr' ? 'En attente' : 'Pending')
                        : (language === 'fr' ? 'Livré' : 'Delivered')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold mb-4">
              {language === 'fr' ? 'Dernières transactions' : 'Recent Transactions'}
            </h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'sale'
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {transaction.type === 'sale' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'sale'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'sale' ? '+' : '-'}{formatPrice(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold mb-4">
            {language === 'fr' ? 'Produits les plus vendus' : 'Best Selling Products'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-medium mb-1 line-clamp-2 text-sm">{product.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-600">
                    {product.salePrice && formatPrice(product.salePrice)}
                  </span>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'fr' ? 'Stock:' : 'Stock:'} {product.stock}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
