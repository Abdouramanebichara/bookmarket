import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AuthModals } from '../components/modals/AuthModals';
import { ProfileModal } from '../components/modals/ProfileModal';
import { ProductModal } from '../components/modals/ProductModal';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocalization, Language } from '../context/LocalizationContext';

export function RootLayout() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const { setLanguage } = useLocalization();

  // Synchroniser le thème et la langue de l'utilisateur
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme as 'light' | 'dark');
    }
    if (user?.language) {
      setLanguage(user.language as Language);
    }
  }, [user?.theme, user?.language, setTheme, setLanguage]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navbar
        onOpenLogin={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onOpenSignup={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      <main className="flex-1">
        <Outlet context={{ setSelectedProduct }} />
      </main>

      <Footer />

      {/* Modales */}
      <AuthModals
        isOpen={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
