import { Outlet, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useWallet } from '../context/WalletContext';
import { Sidebar, SidebarItem } from '../components/Sidebar';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { CurrencySwitcher } from '../components/CurrencySwitcher';
import {
  Bell, User, LogOut, LayoutDashboard, Package, Plus, TrendingUp,
  ShoppingBag, DollarSign, Wallet, FileText, BarChart3, Settings, Store, Menu, X, MessageSquare
} from 'lucide-react';

export function LibrairieLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language } = useLocalization();
  const { wallet } = useWallet();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount] = useState(3);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Sidebar items for librairie
  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      path: '/librairie/dashboard',
    },
    {
      id: 'divider-1',
      label: '',
      icon: Store,
      path: '',
      divider: true,
    },
    {
      id: 'products',
      label: 'Mes produits',
      labelEn: 'My Products',
      icon: Package,
      path: '/librairie/products',
    },
    {
      id: 'add-product',
      label: 'Ajouter un produit',
      labelEn: 'Add Product',
      icon: Plus,
      path: '/librairie/products/new',
    },
    {
      id: 'inventory',
      label: 'Gestion du stock',
      labelEn: 'Stock Management',
      icon: TrendingUp,
      path: '/librairie/inventory',
    },
    {
      id: 'divider-2',
      label: '',
      icon: Store,
      path: '',
      divider: true,
    },
    {
      id: 'orders',
      label: 'Commandes reçues',
      labelEn: 'Received Orders',
      icon: ShoppingBag,
      path: '/librairie/orders',
      badge: 5,
    },
    {
      id: 'sales',
      label: 'Ventes',
      labelEn: 'Sales',
      icon: DollarSign,
      path: '/librairie/sales',
    },
    {
      id: 'wallet',
      label: 'Portefeuille',
      labelEn: 'Wallet',
      icon: Wallet,
      path: '/librairie/wallet',
    },
    {
      id: 'product-requests',
      label: 'Demandes clients',
      labelEn: 'Client requests',
      icon: MessageSquare,
      path: '/librairie/product-requests',
    },
    {
      id: 'digital',
      label: 'Produits numériques',
      labelEn: 'Digital Products',
      icon: FileText,
      path: '/librairie/digital-products',
    },
    {
      id: 'divider-3',
      label: '',
      icon: Store,
      path: '',
      divider: true,
    },
    {
      id: 'statistics',
      label: 'Statistiques',
      labelEn: 'Statistics',
      icon: BarChart3,
      path: '/librairie/statistics',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      labelEn: 'Settings',
      icon: Settings,
      path: '/librairie/settings',
    },
    {
      id: 'divider-4',
      label: '',
      icon: Store,
      path: '',
      divider: true,
    },
    {
      id: 'logout',
      label: 'Déconnexion',
      labelEn: 'Logout',
      icon: LogOut,
      path: '/auth/login',
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
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

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Navigation Bar - Simplified */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
          <div className="max-w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label={language === 'fr' ? 'Ouvrir le menu librairie' : 'Open library menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Librairie Badge */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    {language === 'fr' ? 'Espace Professionnel' : 'Professional Space'}
                  </span>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                {/* Language & Currency Switchers */}
                <div className="hidden md:flex items-center gap-1">
                  <LanguageSwitcher />
                  <CurrencySwitcher />
                </div>

                {/* Notifications */}
                <button
                  onClick={() => navigate('/librairie/notifications')}
                  className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                {user && (
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                        <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="hidden lg:block text-sm font-medium max-w-32 truncate">{user.name}</span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="p-2">
                        <button
                          onClick={() => navigate('/librairie/profile')}
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
                )}
              </div>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-border shadow-sm">
            <nav className="p-4 space-y-2">
              {sidebarItems.filter(item => !item.divider).map((item) => {
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
                      <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <span className="font-medium">{label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500 text-white">{item.badge > 99 ? '99+' : item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="px-4 pb-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 justify-center">
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
              © 2026 BookStore - {language === 'fr' ? 'Espace Professionnel' : 'Professional Space'}
            </div>
          </div>
        </footer>
      </div>
    </div>

    {/* Modal confirmation déconnexion */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <LogOut className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">
                {language === 'fr' ? 'Se déconnecter ?' : 'Log out?'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'fr'
                  ? 'Vous serez redirigé vers la page de connexion.'
                  : 'You will be redirected to the login page.'}
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'fr' ? 'Déconnecter' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
