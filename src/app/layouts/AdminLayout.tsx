import { Outlet, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { CurrencySwitcher } from '../components/CurrencySwitcher';
import {
  LayoutDashboard, Users, Store, Shield, Tag, Globe,
  BarChart3, Settings, Bell, User, Menu, X, FileText, Lock, LogOut
} from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(2);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const mainNav = [
    { label: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Utilisateurs', path: '/admin/users', icon: Users },
    { label: 'Librairies', path: '/admin/libraries', icon: Store },
    { label: 'Validations', path: '/admin/validations', icon: Shield },
    { label: 'Catégories', path: '/admin/categories', icon: Tag },
    { label: 'Langues & Devises', path: '/admin/localization', icon: Globe },
    { label: 'Rapports', path: '/admin/reports', icon: FileText },
    { label: 'Statistiques', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Audit', path: '/admin/audit', icon: Lock },
    { label: 'Paramètres', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-border transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-bold text-sm">BookStore</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Admin</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-muted rounded transition-colors mx-auto"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors ${
                    !sidebarOpen && 'justify-center'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {user && (
          <div className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors ${
                !sidebarOpen && 'justify-center'
              }`}
              title={!sidebarOpen ? 'Déconnexion' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Title for mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-bold">Admin</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language & Currency Switchers */}
            <div className="hidden md:flex items-center gap-1">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>

            {/* Notifications */}
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-xs text-muted-foreground">Administrateur</p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/admin/profile')}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors mt-2"
                    >
                      Mon Profil
                    </button>
                    <button
                      onClick={() => navigate('/admin/settings')}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      Paramètres Système
                    </button>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-border">
            <nav className="p-4 space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Language & Currency Switchers */}
            <div className="px-4 pb-4 border-t border-border pt-4">
              <div className="flex items-center gap-2 justify-center">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
