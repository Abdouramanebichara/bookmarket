import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, SortAsc, Grid, List } from 'lucide-react';
import { toast } from 'sonner';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [sortBy, setSortBy] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleRemoveFavorite = (productId: string) => {
    const product = favorites.find(p => p.id === productId);
    if (product) {
      toggleFavorite(product);
      toast.success('Retiré des favoris');
    }
  };

  const handleAddToCart = (product: (typeof favorites)[0]) => {
    addToCart(product, product.type === 'rental' ? 'rental' : 'sale');
    toast.success('Produit ajouté au panier');
  };

  const sortedProducts = [...favorites].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.salePrice || 0) - (b.salePrice || 0);
    if (sortBy === 'price-desc') return (b.salePrice || 0) - (a.salePrice || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mes Favoris</h1>
              <p className="text-sm text-muted-foreground">Vos produits préférés en un seul endroit</p>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Aucun favori pour le moment</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Commencez à ajouter vos livres préférés à votre liste de favoris en cliquant sur l'icône cœur
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Découvrir notre catalogue
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-slide-in-right">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-2xl text-red-600 dark:text-red-400">{favorites.length}</span>
                  {' '}produit{favorites.length > 1 ? 's' : ''} favori{favorites.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
                  <SortAsc className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="recent">Récents</option>
                    <option value="title">Nom (A-Z)</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="rating">Mieux notés</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`animate-fade-in ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
              {sortedProducts.map((product, index) => (
                <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard
                    product={product}
                    onFavorite={handleRemoveFavorite}
                    isFavorite={isFavorite(product.id)}
                    onAddToCart={() => handleAddToCart(product)}
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
