import { MapPin, Star, Phone, Clock, ExternalLink } from 'lucide-react';
import { Librairie } from '../types';

interface LibraryCardProps {
  library: Librairie;
  onClick?: () => void;
  showDistance?: boolean;
}

export function LibraryCard({ library, onClick, showDistance = true }: LibraryCardProps) {
  return (
    <div
      className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-border"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={library.coverImage || 'https://via.placeholder.com/600x300'}
          alt={library.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {library.verified && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Vérifié
          </div>
        )}
        {library.logo && (
          <div className="absolute bottom-3 left-3 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-white">
            <img src={library.logo} alt={library.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex-1">
            {library.name}
          </h3>
          {library.rating > 0 && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{library.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({library.reviewsCount})</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{library.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">
              {library.location.address}, {library.location.city}
            </span>
          </div>

          {showDistance && library.distance !== undefined && (
            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              <MapPin className="w-4 h-4" />
              <span>{library.distance.toFixed(1)} km de vous</span>
            </div>
          )}

          {library.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{library.phone}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{library.productsCount} produits</span>
            </div>
            <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
              Voir plus
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
