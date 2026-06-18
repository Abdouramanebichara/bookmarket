import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { EXCHANGE_RATES } from '../data/mockData';
import { translations, TranslationKey } from './translations';

export type Currency = 'XAF' | 'EUR' | 'USD';
export type Language = 'fr' | 'en';

type TranslationObject = Record<string, string>;

const languages = {
  fr: 'Français',
  en: 'English',
};

export { languages };

interface LocalizationContextType {
  currency: Currency;
  language: Language;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  formatPrice: (priceInXAF: number) => string;
  t: TranslationObject;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'bookmarket_currency';
const LANGUAGE_STORAGE_KEY = 'bookmarket_language';

function readStoredValue<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  const value = localStorage.getItem(key) as T | null;
  return value && allowed.includes(value) ? value : fallback;
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => readStoredValue<Currency>(CURRENCY_STORAGE_KEY, 'XAF', ['XAF', 'EUR', 'USD']));
  const [language, setLanguageState] = useState<Language>(() => readStoredValue<Language>(LANGUAGE_STORAGE_KEY, 'fr', ['fr', 'en']));

  const setCurrency = (value: Currency) => setCurrencyState(value);
  const setLanguage = (value: Language) => setLanguageState(value);

  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const formatPrice = (priceInXAF: number): string => {
    const convertedPrice = priceInXAF * EXCHANGE_RATES[currency];

    const formatter = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'XAF' ? 0 : 2,
    });

    return formatter.format(convertedPrice);
  };

  // Get the full translations object for the current language
  const t = translations[language] || translations.fr;

  return (
    <LocalizationContext.Provider
      value={{
        currency,
        language,
        setCurrency,
        setLanguage,
        formatPrice,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
