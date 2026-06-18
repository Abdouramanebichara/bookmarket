import { useState } from 'react';
import { useReviews } from '../context/ReviewsContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import { MessageSquare, Star, Filter, TrendingUp, User } from 'lucide-react';

export function LibrairieReviewsPage() {
  const { reviews } = useReviews();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  // Show reviews for products belonging to this library (lib-1)
  const libraryProductIds = new Set(
    MOCK_PRODUCTS.filter(p => p.librarieId === 'lib-1').map(p => p.id)
  );
  const libraryReviews = reviews.filter(r => libraryProductIds.has(r.productId) || r.libraryId === 'lib-1');

  let filteredReviews = filterRating === 'all'
    ? libraryReviews
    : libraryReviews.filter(r => r.rating === filterRating);

  filteredReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const totalReviews = libraryReviews.length;
  const avgRating = totalReviews > 0
    ? libraryReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: libraryReviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (libraryReviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0,
  }));

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Avis et Commentaires</h1>
              <p className="text-sm text-muted-foreground">Consultez les avis de vos clients</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Note Moyenne</p>
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                  {avgRating > 0 ? avgRating.toFixed(1) : '-'}
                </p>
              </div>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            {avgRating > 0 && <div className="flex items-center gap-1">{renderStars(Math.round(avgRating))}</div>}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Avis</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalReviews}</p>
              </div>
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Répartition</h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-6">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtres</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filtrer par note</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterRating('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${filterRating === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                  Toutes
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${filterRating === rating ? 'bg-yellow-500 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  >
                    {rating} <Star className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="recent">Plus récents</option>
                <option value="rating">Note (élevée à faible)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Aucun avis</h2>
            <p className="text-muted-foreground">
              {filterRating === 'all' ? "Vous n'avez pas encore reçu d'avis" : `Aucun avis avec ${filterRating} étoile${filterRating > 1 ? 's' : ''}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const product = MOCK_PRODUCTS.find(p => p.id === review.productId);
              return (
                <div key={review.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{review.userName || 'Client'}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        {product && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Pour: <span className="font-medium">{product.title}</span>
                          </p>
                        )}
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
