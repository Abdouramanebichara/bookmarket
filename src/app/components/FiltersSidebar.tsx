import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Category, ProductType } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface FiltersSidebarProps {
  categories: Category[];
  onApplyFilters: (filters: any) => void;
  onClose?: () => void;
  open?: boolean;
}

export function FiltersSidebar({ categories, onApplyFilters, onClose, open = true }: FiltersSidebarProps) {
  const { t, language } = useLocalization();
  const getCategoryName = (cat: Category) => typeof cat.name === 'string' ? cat.name : cat.name[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [productType, setProductType] = useState<ProductType | ''>('');
  const [rating, setRating] = useState<number>(0);
  const [condition, setCondition] = useState<string[]>([]);

  const handleApply = () => {
    const filters: any = {};

    if (selectedCategory) filters.categoryId = selectedCategory;
    if (priceRange.min) filters.minPrice = parseFloat(priceRange.min);
    if (priceRange.max) filters.maxPrice = parseFloat(priceRange.max);
    if (productType) filters.type = productType;
    if (rating > 0) filters.rating = rating;
    if (condition.length > 0) filters.condition = condition;

    onApplyFilters(filters);
    onClose?.();
  };

  const handleReset = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setProductType('');
    setRating(0);
    setCondition([]);
    onApplyFilters({});
  };

  if (!open) return null;

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Filtres</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Catégorie</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {getCategoryName(cat)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prix (XAF)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="space-y-2">
            {[
              { value: '', label: 'Tous' },
              { value: 'sale', label: 'Vente uniquement' },
              { value: 'rental', label: 'Location uniquement' },
              { value: 'both', label: 'Vente et location' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="productType"
                  value={option.value}
                  checked={productType === option.value}
                  onChange={(e) => setProductType(e.target.value as ProductType | '')}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Note minimum</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">État</label>
          <div className="space-y-2">
            {[
              { value: 'new', label: 'Neuf' },
              { value: 'like-new', label: 'Comme neuf' },
              { value: 'good', label: 'Bon état' },
              { value: 'acceptable', label: 'Acceptable' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={condition.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCondition([...condition, option.value]);
                    } else {
                      setCondition(condition.filter((c) => c !== option.value));
                    }
                  }}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
