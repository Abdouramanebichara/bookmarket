import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'Une erreur inattendue s\'est produite';
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
    errorDetails = error.data?.toString() || '';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  }

  console.error('Route error:', error);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Oops! Quelque chose s'est mal passé</h1>

          <p className="text-muted-foreground mb-6">
            {errorMessage}
          </p>

          {errorDetails && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
                Détails de l'erreur
              </summary>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                {errorDetails}
              </pre>
            </details>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Rafraîchir la page
            </button>
            <Link
              to="/"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
