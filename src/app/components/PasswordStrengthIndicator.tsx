import { validatePassword } from '../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const validation = validatePassword(password);

  const getStrengthColor = () => {
    if (validation.strength === 'strong') return 'bg-green-500';
    if (validation.strength === 'medium') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthWidth = () => {
    if (validation.strength === 'strong') return 'w-full';
    if (validation.strength === 'medium') return 'w-2/3';
    return 'w-1/3';
  };

  const getStrengthText = () => {
    if (validation.strength === 'strong') return 'Fort';
    if (validation.strength === 'medium') return 'Moyen';
    return 'Faible';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {getStrengthText()}
        </span>
      </div>

      {validation.errors.length > 0 && (
        <ul className="space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index} className="text-xs text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-600" />
              {error}
            </li>
          ))}
        </ul>
      )}

      {validation.isValid && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Mot de passe sécurisé</span>
        </div>
      )}
    </div>
  );
}
