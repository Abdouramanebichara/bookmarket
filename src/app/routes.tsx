import { createBrowserRouter } from 'react-router';
import { RouteWrapper } from './RouteWrapper';
import { ClientLayout } from './layouts/ClientLayout';
import { LibrairieLayout } from './layouts/LibrairieLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RequireAuth } from './components/RequireAuth';
import { ImprovedHomePage } from './pages/ImprovedHomePage';
import { ImprovedHomePageDemo } from './pages/ImprovedHomePageDemo';
import { CatalogPage } from './pages/CatalogPage';
import { CatalogPageDemo } from './pages/CatalogPageDemo';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProductDetailsPageDemo } from './pages/ProductDetailsPageDemo';
import { CartPage } from './pages/CartPage';
import { CartPageDemo } from './pages/CartPageDemo';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { LibrairieDetailsPage } from './pages/LibrairieDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { ExploreLibrairiesPage } from './pages/ExploreLibrairiesPage';
import { LibrairieDashboardPage } from './pages/LibrairieDashboardPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { LibrairieProductsPage } from './pages/LibrairieProductsPage';
import { LibrairieInventoryPage } from './pages/LibrairieInventoryPage';
import { LibrairieOrdersPage } from './pages/LibrairieOrdersPage';
import { LibrairieRentalsPage } from './pages/LibrairieRentalsPage';
import { LibrairieCustomersPage } from './pages/LibrairieCustomersPage';
import { LibrairieReviewsPage } from './pages/LibrairieReviewsPage';
import { LibrairieNotificationsPage } from './pages/LibrairieNotificationsPage';
import { LibrairieSettingsPage } from './pages/LibrairieSettingsPage';
import { LibrairieProfilePage } from './pages/LibrairieProfilePage';
import { LibrairieStatisticsPage } from './pages/LibrairieStatisticsPage';
import { LibrairieWalletPage } from './pages/LibrairieWalletPage';
import { LibrairieSalesPage } from './pages/LibrairieSalesPage';
import { LibrairieDigitalProductsPage } from './pages/LibrairieDigitalProductsPage';
import { LibrairieProductRequestsPage } from './pages/LibrairieProductRequestsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { OrdersPage } from './pages/OrdersPage';
import { RentalsPage } from './pages/RentalsPage';
import { LibraryMapPage } from './pages/LibraryMapPage';
import { LibrariesMapDemo } from './pages/LibrariesMapDemo';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminLibrariesPage } from './pages/AdminLibrariesPage';
import { AdminValidationsPage } from './pages/AdminValidationsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminLocalizationPage } from './pages/AdminLocalizationPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminAuditPage } from './pages/AdminAuditPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { ClientProfilePage } from './pages/ClientProfilePage';
import { ClientWalletPage } from './pages/ClientWalletPage';
import { DigitalLibraryPage } from './pages/DigitalLibraryPage';
import { ClientProductRequestsPage } from './pages/ClientProductRequestsPage';
import { DashboardRedirect } from './pages/DashboardRedirect';
import { TestPage } from './pages/TestPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupClientPage } from './pages/auth/SignupClientPage';
import { SignupLibrairiePage } from './pages/auth/SignupLibrairiePage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { EmailVerificationPage } from './pages/auth/EmailVerificationPage';
import { NotFoundRedirect } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RouteWrapper,
    errorElement: <ErrorBoundary />,
    children: [
      // Auth Routes (No Layout)
      {
        path: 'auth',
        errorElement: <ErrorBoundary />,
        children: [
          { path: 'login', Component: LoginPage },
          { path: 'signup/client', Component: SignupClientPage },
          { path: 'signup/librairie', Component: SignupLibrairiePage },
          { path: 'forgot-password', Component: ForgotPasswordPage },
          { path: 'reset-password', Component: ResetPasswordPage },
          { path: 'verify-email', Component: EmailVerificationPage },
          { path: '*', element: <NotFoundRedirect to="/auth/login" />, errorElement: <ErrorBoundary /> },
        ],
      },

      // Client Routes (ClientLayout)
      {
        path: '',
        Component: ClientLayout,
        errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: ImprovedHomePageDemo },
      { path: 'catalog', Component: CatalogPageDemo },
      { path: 'products/:id', Component: ProductDetailsPageDemo },
      { path: 'cart', element: <RequireAuth><CartPageDemo /></RequireAuth> },
      { path: 'checkout', element: <RequireAuth><CheckoutPage /></RequireAuth> },
      { path: 'favorites', element: <RequireAuth><FavoritesPage /></RequireAuth> },
      { path: 'orders', element: <RequireAuth><OrdersPage /></RequireAuth> },
      { path: 'rentals', element: <RequireAuth><RentalsPage /></RequireAuth> },
      { path: 'notifications', element: <RequireAuth><NotificationsPage /></RequireAuth> },
      { path: 'libraries/:id', Component: LibrairieDetailsPage },
      { path: 'libraries', Component: LibrariesMapDemo },
      { path: 'search', Component: SearchPage },
      { path: 'profile', element: <RequireAuth><ClientProfilePage /></RequireAuth> },
      { path: 'wallet', element: <RequireAuth><ClientWalletPage /></RequireAuth> },
      { path: 'digital-library', element: <RequireAuth><DigitalLibraryPage /></RequireAuth> },
      { path: 'product-requests', element: <RequireAuth><ClientProductRequestsPage /></RequireAuth> },
      { path: 'purchase-history', element: <RequireAuth><OrdersPage /></RequireAuth> },
      { path: 'client/dashboard', element: <RequireAuth><ClientDashboard /></RequireAuth> },
      { path: 'test', Component: TestPage },
      { path: 'dashboard', Component: DashboardRedirect },
      { path: '*', element: <NotFoundRedirect to="/" />, errorElement: <ErrorBoundary /> },
    ],
  },

      // Librairie Routes (LibrairieLayout)
      {
        path: 'librairie',
        element: <RequireAuth allowedTypes={['librairie']}><LibrairieLayout /></RequireAuth>,
        errorElement: <ErrorBoundary />,
        children: [
          { path: 'dashboard', Component: LibrairieDashboardPage },
          { path: 'products/new', Component: ProductFormPage },
          { path: 'products/:id/edit', Component: ProductFormPage },
          { path: 'products', Component: LibrairieProductsPage },
          { path: 'inventory', Component: LibrairieInventoryPage },
          { path: 'orders', Component: LibrairieOrdersPage },
          { path: 'rentals', Component: LibrairieRentalsPage },
          { path: 'sales', Component: LibrairieSalesPage },
          { path: 'wallet', Component: LibrairieWalletPage },
          { path: 'digital-products', Component: LibrairieDigitalProductsPage },
          { path: 'product-requests', Component: LibrairieProductRequestsPage },
          { path: 'customers', Component: LibrairieCustomersPage },
          { path: 'reviews', Component: LibrairieReviewsPage },
          { path: 'promotions', element: <div>Promotions</div> },
          { path: 'statistics', Component: LibrairieStatisticsPage },
          { path: 'profile', Component: LibrairieProfilePage },
          { path: 'settings', Component: LibrairieSettingsPage },
          { path: 'notifications', Component: LibrairieNotificationsPage },
          { path: '*', element: <NotFoundRedirect to="/librairie/dashboard" />, errorElement: <ErrorBoundary /> },
        ],
      },

      // Admin Routes (AdminLayout)
      {
        path: 'admin',
        element: <RequireAuth allowedTypes={['admin']}><AdminLayout /></RequireAuth>,
        errorElement: <ErrorBoundary />,
        children: [
          { path: 'dashboard', Component: AdminDashboard },
          { path: 'users', Component: AdminUsersPage },
          { path: 'libraries', Component: AdminLibrariesPage },
          { path: 'validations', Component: AdminValidationsPage },
          { path: 'categories', Component: AdminCategoriesPage },
          { path: 'localization', Component: AdminLocalizationPage },
          { path: 'reports', Component: AdminReportsPage },
          { path: 'analytics', Component: AdminAnalyticsPage },
          { path: 'audit', Component: AdminAuditPage },
          { path: 'settings', Component: AdminSettingsPage },
          { path: 'profile', element: <div>Profil Admin</div> },
          { path: 'notifications', element: <div>Notifications</div> },
          { path: '*', element: <NotFoundRedirect to="/admin/dashboard" />, errorElement: <ErrorBoundary /> },
        ],
      },
    ],
  },
]);
