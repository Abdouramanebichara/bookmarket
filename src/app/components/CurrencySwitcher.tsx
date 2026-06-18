import { useLocalization, Currency } from '../context/LocalizationContext';
import { DollarSign } from 'lucide-react';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useLocalization();

  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'XAF', label: 'XAF', symbol: 'FCFA' },
    { code: 'EUR', label: 'EUR', symbol: '€' },
    { code: 'USD', label: 'USD', symbol: '$' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
        <DollarSign className="w-4 h-4" />
        <span className="text-sm font-medium">{currency}</span>
      </button>

      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-1">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => setCurrency(curr.code)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currency === curr.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{curr.label}</span>
                <span className="text-xs opacity-75">{curr.symbol}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
