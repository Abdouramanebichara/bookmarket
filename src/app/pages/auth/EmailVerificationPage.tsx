import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Token de vérification manquant');
        setVerifying(false);
        return;
      }

      try {
        // Simulation de la vérification
        await new Promise(resolve => setTimeout(resolve, 2000));

        setVerified(true);
        toast.success('Email vérifié avec succès !');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la vérification');
        toast.error('Échec de la vérification');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Loader className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Vérification en cours...</h2>
          <p className="text-muted-foreground">
            Veuillez patienter pendant que nous vérifions votre adresse email.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Échec de la vérification</h2>
          <p className="text-muted-foreground mb-8">{error}</p>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Retour à la connexion
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full border border-border py-3 rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Email vérifié !</h2>
          <p className="text-muted-foreground mb-8">
            Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
          </p>

          <button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return null;
}
