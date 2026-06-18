import { useAuth, UserType } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Lock, LogIn, UserPlus, ShieldAlert } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedTypes?: Exclude<UserType, null>[];
}

export function RequireAuth({ children, allowedTypes }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center mx-auto animate-pulse">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                <Lock className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-muted-foreground mb-8">
            Vous devez être connecté pour accéder à cette page. Connectez-vous ou créez un compte pour continuer.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full bg-accent text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Se connecter
            </button>

            <button
              onClick={() => navigate('/auth/signup/client')}
              className="w-full bg-secondary text-secondary-foreground py-4 rounded-xl font-semibold hover:bg-secondary/80 transition-all flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              Créer un compte
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full text-muted-foreground hover:text-foreground py-2 transition-colors"
            >
              ← Retour
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 opacity-50">
            <div className="h-1 bg-primary rounded-full"></div>
            <div className="h-1 bg-accent rounded-full"></div>
            <div className="h-1 bg-accent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (allowedTypes?.length && (!user?.type || !allowedTypes.includes(user.type))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-sm">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-3">Accès non autorisé</h1>
          <p className="text-muted-foreground mb-6">
            Ce tableau de bord est réservé à un autre type d’utilisateur.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Aller vers mon tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
