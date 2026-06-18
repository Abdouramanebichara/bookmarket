import { Search, ShoppingCart, Bell, Menu, MapPin, LogOut, Heart, Package, Calendar, Map, Store, Globe, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onOpenProfile: () => void;
}

export function Navbar({ onOpenLogin, onOpenSignup, onOpenProfile }: NavbarProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language, setLanguage } = useLocalization();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [notifCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 min-w-fit cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#0D1B3E] rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <span className="font-[var(--font-display)] font-bold text-xl text-[#0D1B3E] dark:text-white hidden sm:block">
              {t('bookmarket')}
            </span>
          </div>

          {/* Location Selector */}
          <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <MapPin className="w-5 h-5 text-[#F97316]" />
            <div className="text-left">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('deliverTo')}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.location || 'Yaoundé, Cameroun'}
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigate('/catalog')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Catalogue
            </button>
            <button
              onClick={() => navigate('/libraries')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              Carte
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-2 py-1 text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary hidden sm:block"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>

            {/* Favorites */}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/favorites')}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors hidden sm:block"
                title="Favoris"
              >
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Panier"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F97316] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors hidden sm:block"
              title="Notifications"
            >
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Auth Buttons or User Menu */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                {user?.type === 'librairie' && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 text-[#0D1B3E] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {t('dashboard')}
                  </button>
                )}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-4 py-2 text-[#0D1B3E] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#0D1B3E]"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                      {user?.type === 'client' ? '👤' : '🏪'}
                    </div>
                  )}
                  {t('profile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-[#0D1B3E] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t('login')}
                </button>
                <button
                  onClick={onOpenSignup}
                  className="px-6 py-2 bg-[#0D1B3E] dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-[#0D1B3E]/90 dark:hover:bg-blue-700 transition-colors shadow-lg shadow-[#0D1B3E]/20 dark:shadow-blue-600/20"
                >
                  {t('signup')}
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchMobilePlaceholder')}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-in slide-in-from-top duration-200">
            {isAuthenticated ? (
              <>
                {user?.type === 'librairie' && (
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[#0D1B3E] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    📊 {t('dashboard')}
                  </button>
                )}
                <button
                  onClick={() => {
                    navigate('/panier');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  🛒 {t('myCart')}
                </button>
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  🔔 {t('notifications')}
                </button>
                <button
                  onClick={() => {
                    onOpenProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-[#0D1B3E] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  👤 {t('profile')}
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                >
                  🚪 {t('logout')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-[#0D1B3E] dark:text-white font-medium bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    onOpenSignup();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-[#0D1B3E] dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-[#0D1B3E]/90 dark:hover:bg-blue-700 transition-colors"
                >
                  {t('signup')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
