import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function DashboardRedirect() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('DashboardRedirect - isAuthenticated:', isAuthenticated, 'user:', user);

    if (!isAuthenticated || !user) {
      console.log('Not authenticated, redirecting to home');
      navigate('/', { replace: true });
      return;
    }

    // Redirect based on user role
    console.log('User type:', user.type);

    if (user.type === 'librairie') {
      console.log('Redirecting to librairie dashboard');
      navigate('/librairie/dashboard', { replace: true });
    } else if (user.type === 'admin') {
      console.log('Redirecting to admin dashboard');
      navigate('/admin/dashboard', { replace: true });
    } else {
      console.log('Redirecting to client dashboard');
      navigate('/client/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
}
