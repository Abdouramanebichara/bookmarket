import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useLocalization } from '../../context/LocalizationContext';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Lock, Mail, LogIn, X } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLocalization();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error(language === 'fr' ? 'Adresse email invalide' : 'Invalid email address');
      return;
    }

    if (!password) {
      toast.error(language === 'fr' ? 'Veuillez entrer votre mot de passe' : 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const userType = await login(email, password, null);
      toast.success(language === 'fr' ? 'Connexion réussie !' : 'Logged in successfully!');
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'librairie') {
        navigate('/librairie/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || (language === 'fr' ? 'Email ou mot de passe incorrect' : 'Incorrect email or password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between text-primary-foreground">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">📚</span>
            </div>
            <span className="text-2xl font-bold">BookStore</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            {language === 'fr'
              ? <>Bienvenue sur la marketplace <br />multi-librairies</>
              : <>Welcome to the<br />multi-bookstore marketplace</>
            }
          </h1>
          <p className="text-lg opacity-90">
            {language === 'fr'
              ? 'Achetez, louez et découvrez des milliers de livres et fournitures'
              : 'Buy, rent and discover thousands of books and supplies'}
          </p>
        </div>

        <div className="space-y-4 opacity-90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              ✓
            </div>
            <span>
              {language === 'fr' ? 'Des milliers de produits disponibles' : 'Thousands of products available'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              ✓
            </div>
            <span>
              {language === 'fr' ? 'Librairies géolocalisées près de chez vous' : 'Geolocated bookstores near you'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              ✓
            </div>
            <span>
              {language === 'fr' ? 'Vente et location de produits' : 'Sale and rental of products'}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Close button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label={language === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {language === 'fr' ? 'Connexion' : 'Login'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Accédez à votre compte BookStore' : 'Access your BookStore account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'fr' ? 'Mot de passe' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border" />
                <span className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Se souvenir de moi' : 'Remember me'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-sm text-primary hover:underline"
              >
                {language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  {language === 'fr' ? 'Connexion...' : 'Logging in...'}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {language === 'fr' ? 'Se connecter' : 'Login'}
                </>
              )}
            </button>
          </form>



          <div className="mt-8 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  {language === 'fr' ? "Vous n'avez pas de compte ?" : "Don't have an account?"}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/auth/signup/client')}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {language === 'fr' ? (
                  <>S'inscrire en tant que <strong className="ml-1">Client</strong></>
                ) : (
                  <>Sign up as <strong className="ml-1">Client</strong></>
                )}
              </button>
              <button
                onClick={() => navigate('/auth/signup/librairie')}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {language === 'fr' ? (
                  <>S'inscrire en tant que <strong className="ml-1">Librairie</strong></>
                ) : (
                  <>Sign up as <strong className="ml-1">Bookstore</strong></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
