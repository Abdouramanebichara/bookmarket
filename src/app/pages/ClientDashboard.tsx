import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useWallet } from '../context/WalletContext';
import { MOCK_ORDERS, MOCK_RENTALS, MOCK_PRODUCTS } from '../data/mockData';
import {
  ShoppingBag, Package, Heart, Calendar, Clock, MapPin,
  Star, TrendingUp, ChevronRight, Wallet, FileText, Plus,
  BookOpen, Search, ArrowUpRight
} from 'lucide-react';
import { Order, Rental, Product } from '../types';

export function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice, language } = useLocalization();
  const { wallet, transactions } = useWallet();

  // Use mock data
  const orders = MOCK_ORDERS.slice(0, 5);
  const rentals = MOCK_RENTALS.slice(0, 5);
  const favorites = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 6);
  const loading = false;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'delivered':
        return 'Livrée';
      case 'active':
        return 'Active';
      case 'returned':
        return 'Retournée';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {language === 'fr' ? `Bienvenue, ${user?.name}!` : `Welcome, ${user?.name}!`}
          </h1>
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Gérez vos commandes, locations et favoris' : 'Manage your orders, rentals and favorites'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {/* Wallet Card */}
              <div
                onClick={() => navigate('/wallet')}
                className="bg-primary rounded-xl p-6 text-primary-foreground shadow-lg cursor-pointer hover:scale-105 transition-transform"
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

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{orders.filter(o => o.status === 'pending').length}</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Commandes en cours' : 'Orders in Progress'}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold mb-1">{orders.filter(o => o.status === 'delivered').length}</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Commandes terminées' : 'Completed Orders'}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold mb-1">2</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'PDFs achetés' : 'PDFs Purchased'}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold mb-1">{favorites.length}</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Favoris' : 'Favorites'}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                {language === 'fr' ? 'Actions rapides' : 'Quick Actions'}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/wallet')}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {language === 'fr' ? 'Recharger Wallet' : 'Recharge Wallet'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'fr' ? 'Ajouter des fonds' : 'Add funds'}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/catalog')}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {language === 'fr' ? 'Voir Catalogue' : 'View Catalog'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'fr' ? 'Explorer les produits' : 'Explore products'}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/orders')}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {language === 'fr' ? 'Mes Commandes' : 'My Orders'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'fr' ? 'Suivre mes achats' : 'Track purchases'}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/digital-library')}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors">
                      <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {language === 'fr' ? 'Mes PDF' : 'My PDFs'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'fr' ? 'Livres numériques' : 'Digital books'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Orders */}
              <div className="bg-card rounded-lg border border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Commandes récentes</h3>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Voir tout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-6 hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium mb-1">
                              Commande #{order.id.slice(0, 8)}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="font-bold text-primary">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune commande pour le moment</p>
                      <button
                        onClick={() => navigate('/catalog')}
                        className="mt-4 text-primary hover:underline"
                      >
                        Découvrir le catalogue
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Rentals */}
              <div className="bg-card rounded-lg border border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Locations actives</h3>
                  <button
                    onClick={() => navigate('/rentals')}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Voir tout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {rentals.length > 0 ? (
                    rentals.map((rental) => (
                      <div
                        key={rental.id}
                        onClick={() => navigate(`/rentals/${rental.id}`)}
                        className="p-6 hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium mb-1">
                              Location #{rental.id.slice(0, 8)}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Jusqu'au {new Date(rental.endDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rental.status)}`}>
                            {getStatusLabel(rental.status)}
                          </span>
                        </div>
                        <div className="font-bold text-blue-600">
                          {formatPrice(rental.totalAmount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune location active</p>
                      <button
                        onClick={() => navigate('/catalog')}
                        className="mt-4 text-primary hover:underline"
                      >
                        Louer un produit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mes favoris</h3>
                <button
                  onClick={() => navigate('/favorites')}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Voir tout
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {favorites.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {favorites.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/300x400'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium mb-1 line-clamp-1">{product.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{product.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                          {product.salePrice && formatPrice(product.salePrice)}
                        </span>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun favori pour le moment</p>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="mt-4 text-primary hover:underline"
                  >
                    Explorer le catalogue
                  </button>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/libraries')}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors text-left"
              >
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Librairies près de vous</h4>
                <p className="text-sm text-muted-foreground">
                  Découvrez les librairies dans votre région
                </p>
              </button>

              <button
                onClick={() => navigate('/catalog')}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors text-left"
              >
                <Package className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Explorer le catalogue</h4>
                <p className="text-sm text-muted-foreground">
                  Des milliers de produits disponibles
                </p>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors text-left"
              >
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Programme de fidélité</h4>
                <p className="text-sm text-muted-foreground">
                  Gagnez des points à chaque achat
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
