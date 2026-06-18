import { Outlet } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { WalletProvider } from './context/WalletContext';
import { OrdersProvider } from './context/OrdersContext';
import { RentalsProvider } from './context/RentalsContext';
import { DigitalBooksProvider } from './context/DigitalBooksContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { LibraryProductsProvider } from './context/LibraryProductsContext';
import { LibraryOrdersProvider } from './context/LibraryOrdersContext';
import { LibraryRentalsProvider } from './context/LibraryRentalsContext';
import { Toaster } from './components/ui/sonner';
import { AutoTranslate } from './components/AutoTranslate';
import { AdminPlatformProvider } from './context/AdminPlatformContext';
import { ProductRequestsProvider } from './context/ProductRequestsContext';

export function RouteWrapper() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <AuthProvider>
          <AdminPlatformProvider>
          <WalletProvider>
            <OrdersProvider>
              <RentalsProvider>
                <DigitalBooksProvider>
                <FavoritesProvider>
                <ReviewsProvider>
                <LibraryProductsProvider>
                <LibraryOrdersProvider>
                <LibraryRentalsProvider>
                <ProductRequestsProvider>
                <NotificationsProvider>
                <CartProvider>
                  <Outlet />
                  <AutoTranslate />
                  <Toaster />
                </CartProvider>
                </NotificationsProvider>
                </ProductRequestsProvider>
                </LibraryRentalsProvider>
                </LibraryOrdersProvider>
                </LibraryProductsProvider>
                </ReviewsProvider>
                </FavoritesProvider>
                </DigitalBooksProvider>
              </RentalsProvider>
            </OrdersProvider>
          </WalletProvider>
        </AdminPlatformProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
