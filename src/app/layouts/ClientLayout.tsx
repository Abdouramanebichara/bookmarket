import { Outlet, useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useWallet } from '../context/WalletContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationsContext';
import { Sidebar, SidebarItem } from '../components/Sidebar';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { CurrencySwitcher } from '../components/CurrencySwitcher';
import {
  Search, Bell, User, LogOut, Home, BookOpen, MapPin, ShoppingCart,
  Package, Wallet, FileText, Heart, Calendar, Menu, X, MessageSquare
} from 'lucide-react';

export function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language } = useLocalization();
  const { wallet } = useWallet();
  const { itemCount } = useCart();
  const { unreadCount: notificationCount } = useNotifications();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Sidebar items for client (only shown when authenticated)
  const sidebarItems: SidebarItem[] = [
    {
      id: 'cart',
      label: 'Mon panier',
      labelEn: 'My Cart',
      icon: ShoppingCart,
      path: '/cart',
      badge: itemCount > 0 ? itemCount : undefined,
    },
    {
      id: 'orders',
      label: 'Mes commandes',
      labelEn: 'My Orders',
      icon: Package,
      path: '/orders',
    },
    {
      id: 'rentals',
      label: 'Mes locations',
      labelEn: 'My Rentals',
      icon: Calendar,
      path: '/rentals',
    },
    {
      id: 'wallet',
      label: 'Mon Portefeuille',
      labelEn: 'My Wallet',
      icon: Wallet,
      path: '/wallet',
    },
    {
      id: 'digital',
      label: 'Mes PDF',
      labelEn: 'My PDFs',
      icon: FileText,
      path: '/digital-library',
    },
    {
      id: 'product-requests',
      label: 'Demandes produit',
      labelEn: 'Product requests',
      icon: MessageSquare,
      path: '/product-requests',
    },
    {
      id: 'favorites',
      label: 'Favoris',
      labelEn: 'Favorites',
      icon: Heart,
      path: '/favorites',
    },
    {
      id: 'divider-1',
      label: '',
      icon: Home,
      path: '',
      divider: true,
    },
    {
      id: 'profile',
      label: 'Mon profil',
      labelEn: 'My Profile',
      icon: User,
      path: '/profile',
    },
    {
      id: 'logout',
      label: 'Déconnexion',
      labelEn: 'Logout',
      icon: LogOut,
      path: '/auth/login',
    },
  ];

  // Show sidebar only for authenticated users
  const showSidebar = !!user;

  // Check if route is active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Only for authenticated users */}
      {showSidebar && (
        <Sidebar
          items={sidebarItems}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onItemClick={(item) => {
            if (item.id === 'logout') {
              setShowLogoutConfirm(true);
              return true;
            }
          }}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64') : 'ml-0'}`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              {showSidebar && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label={language === 'fr' ? 'Ouvrir le menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              {/* Logo - Only shown when not authenticated (no sidebar) */}
              {!showSidebar && (
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <span className="hidden sm:inline text-xl font-bold">BookStore</span>
                </button>
              )}

              {/* Main Navigation Links - Accueil & Catalogue */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-[45vw] sm:max-w-none no-scrollbar">
                <button
                  onClick={() => navigate('/')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">
                    {language === 'fr' ? 'Accueil' : 'Home'}
                  </span>
                </button>
                <button
                  onClick={() => navigate('/catalog')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/catalog')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">
                    {language === 'fr' ? 'Catalogue' : 'Catalog'}
                  </span>
                </button>
                <button
                  onClick={() => navigate('/libraries')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/libraries')
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium hidden lg:block">
                    {language === 'fr' ? 'Librairies' : 'Libraries'}
                  </span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="hidden md:block flex-1 max-w-md mx-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </form>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Language & Currency Switchers */}
                <div className="hidden md:flex items-center gap-1">
                  <LanguageSwitcher />
                  <CurrencySwitcher />
                </div>

                {/* Notifications - Only for authenticated users */}
                {user && (
                  <button
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                )}

                {/* User Menu */}
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden lg:block text-sm font-medium max-w-32 truncate">{user.name}</span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="p-2">
                        <button
                          onClick={() => navigate('/profile')}
                          className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          {language === 'fr' ? 'Mon Profil' : 'My Profile'}
                        </button>
                        <hr className="my-2 border-border" />
                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'fr' ? 'Déconnexion' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {language === 'fr' ? 'Connexion' : 'Login'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {showSidebar && mobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-border shadow-sm">
            <div className="p-4 space-y-4">
              <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </form>

              <div className="grid grid-cols-1 gap-2">
                {[{ id: 'home', label: 'Accueil', labelEn: 'Home', icon: Home, path: '/' }, { id: 'catalog', label: 'Catalogue', labelEn: 'Catalog', icon: BookOpen, path: '/catalog' }, { id: 'libraries', label: 'Librairies', labelEn: 'Libraries', icon: MapPin, path: '/libraries' }, ...sidebarItems.filter(item => !item.divider)].map((item) => {
                  const Icon = item.icon;
                  const label = language === 'fr' ? item.label : (item.labelEn || item.label);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          setMobileMenuOpen(false);
                          setShowLogoutConfirm(true);
                          return;
                        }
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{label}</span>
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">{item.badge > 99 ? '99+' : item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-border pt-4">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border mt-auto">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-muted-foreground">
              © 2026 BookStore. {language === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}.
            </div>
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold">
                {language === 'fr' ? 'Confirmer la déconnexion' : 'Confirm logout'}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              {language === 'fr'
                ? 'Êtes-vous sûr de vouloir vous déconnecter ?'
                : 'Are you sure you want to log out?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {language === 'fr' ? 'Déconnecter' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
