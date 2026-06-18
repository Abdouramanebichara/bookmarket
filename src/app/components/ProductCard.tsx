import { Heart, MapPin, Star, ShoppingCart } from 'lucide-react';
import { Product, Currency } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface ProductCardProps {
  product: Product & { librarieDistance?: number };
  onFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  onAddToCart?: (product: Product) => void;
  onClick?: () => void;
}

export function ProductCard({ product, onFavorite, isFavorite, onAddToCart, onClick }: ProductCardProps) {
  const { t } = useLocalization();

  const formatPrice = (price: number, currency: Currency) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-border"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300x400'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
            ⭐ {t.featured}
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">{t.outOfStock}</span>
          </div>
        )}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product.id);
            }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-foreground hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {product.author && (
          <p className="text-sm text-muted-foreground mb-2">{product.author}</p>
        )}

        <div className="flex items-center gap-4 mb-3">
          {product.type !== 'rental' && product.salePrice && (
            <div>
              <span className="text-sm text-muted-foreground">{t.salePrice}</span>
              <p className="text-lg font-bold text-primary">
                {formatPrice(product.salePrice, 'XAF')}
              </p>
            </div>
          )}
          {product.type !== 'sale' && product.rentalPricePerDay && (
            <div>
              <span className="text-sm text-muted-foreground">{t.rental}</span>
              <p className="text-sm font-semibold text-accent">
                {formatPrice(product.rentalPricePerDay, 'XAF')}/j
              </p>
            </div>
          )}
        </div>

        {product.librarieDistance !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3 h-3" />
            <span>{product.librarieDistance.toFixed(1)} km</span>
          </div>
        )}

        {onAddToCart && product.available && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.addToCart}</span>
          </button>
        )}
      </div>
    </div>
  );
}
