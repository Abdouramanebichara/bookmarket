import { useState } from 'react';
import { Globe, DollarSign, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  active: boolean;
  default: boolean;
}

interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  active: boolean;
  default: boolean;
}

const MOCK_LANGUAGES: LanguageConfig[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', active: true, default: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', active: true, default: false },
];

const MOCK_CURRENCIES: CurrencyConfig[] = [
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', exchangeRate: 1.0, active: true, default: true },
  { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.0015, active: true, default: false },
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 0.0016, active: true, default: false },
];

export function AdminLocalizationPage() {
  const [languages, setLanguages] = useState(MOCK_LANGUAGES);
  const [currencies, setCurrencies] = useState(MOCK_CURRENCIES);

  const handleToggleLanguage = (code: string) => {
    setLanguages(languages.map(lang =>
      lang.code === code ? { ...lang, active: !lang.active } : lang
    ));
    toast.success('Langue mise à jour');
  };

  const handleToggleCurrency = (code: string) => {
    setCurrencies(currencies.map(curr =>
      curr.code === code ? { ...curr, active: !curr.active } : curr
    ));
    toast.success('Devise mise à jour');
  };

  const handleSetDefaultLanguage = (code: string) => {
    setLanguages(languages.map(lang => ({
      ...lang,
      default: lang.code === code,
    })));
    toast.success('Langue par défaut modifiée');
  };

  const handleSetDefaultCurrency = (code: string) => {
    setCurrencies(currencies.map(curr => ({
      ...curr,
      default: curr.code === code,
    })));
    toast.success('Devise par défaut modifiée');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/20 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Langues et Devises</h1>
              <p className="text-sm text-muted-foreground">
                Gérez les options de localisation de la plateforme
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Langues</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{languages.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Langues Actives</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {languages.filter(l => l.active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Devises</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currencies.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Devises Actives</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {currencies.filter(c => c.active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Languages Section */}
          <div className="animate-slide-in-left">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Langues
                  </h2>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="divide-y divide-border">
                {languages.map((language) => (
                  <div key={language.code} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{language.flag}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{language.nativeName}</h3>
                            {language.default && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-medium">
                                Par défaut
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{language.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Code: {language.code.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!language.default && (
                          <button
                            onClick={() => handleSetDefaultLanguage(language.code)}
                            className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                          >
                            Définir par défaut
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleLanguage(language.code)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            language.active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {language.active ? 'Active' : 'Inactive'}
                        </button>
                        <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Currencies Section */}
          <div className="animate-slide-in-right">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Devises
                  </h2>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="divide-y divide-border">
                {currencies.map((currency) => (
                  <div key={currency.code} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{currency.code}</h3>
                          {currency.default && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-medium">
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{currency.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Symbole: <strong>{currency.symbol}</strong></span>
                          <span>•</span>
                          <span>Taux: <strong>{currency.exchangeRate}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!currency.default && (
                          <button
                            onClick={() => handleSetDefaultCurrency(currency.code)}
                            className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                          >
                            Définir par défaut
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleCurrency(currency.code)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            currency.active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {currency.active ? 'Active' : 'Inactive'}
                        </button>
                        <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
