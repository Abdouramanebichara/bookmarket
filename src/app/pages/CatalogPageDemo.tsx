import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { CATEGORIES, MOCK_LIBRAIRIES } from '../data/mockData';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { Star, ShoppingCart, Calendar, Filter, MapPin, X, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function CatalogPageDemo() {
  const navigate = useNavigate();
  const { formatPrice, t, language } = useLocalization();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { visibleProducts } = useAdminPlatform();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filter products
  let filteredProducts = [...visibleProducts];

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === selectedCategory);
  }

  if (priceRange !== 'all') {
    filteredProducts = filteredProducts.filter(p => {
      if (!p.salePrice) return false;
      if (priceRange === 'low') return p.salePrice < 5000;
      if (priceRange === 'medium') return p.salePrice >= 5000 && p.salePrice < 15000;
      if (priceRange === 'high') return p.salePrice >= 15000;
      return true;
    });
  }

  // Sort products
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'featured') {
    filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const handleAddToCart = (productId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const product = visibleProducts.find(p => p.id === productId);
    if (!product) return;

    const mode: 'sale' | 'rental' | 'digital' =
      product.salePrice ? 'sale' :
      product.digitalPrice ? 'digital' :
      'rental';

    const added = addToCart(product, mode, 1, mode === 'rental' ? 7 : undefined);
    if (added) toast.success(language === 'fr' ? `"${product.title}" ajouté au panier !` : `"${product.title}" added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.catalog || 'Catalogue'}</h1>
          <p className="text-muted-foreground">
            {language === 'fr'
              ? `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} disponible${filteredProducts.length > 1 ? 's' : ''}`
              : `${filteredProducts.length} product${filteredProducts.length > 1 ? 's' : ''} available`
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg p-6 border border-border sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="font-semibold">{language === 'fr' ? 'Filtres' : 'Filters'}</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{language === 'fr' ? 'Catégories' : 'Categories'}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{language === 'fr' ? 'Toutes' : 'All'}</span>
                  </label>
                  {CATEGORIES.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{category.icon} {category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{language === 'fr' ? 'Prix' : 'Price'}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'all'}
                      onChange={() => setPriceRange('all')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{language === 'fr' ? 'Tous' : 'All'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'low'}
                      onChange={() => setPriceRange('low')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{language === 'fr' ? 'Moins de 5 000 XAF' : 'Less than 5,000 XAF'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'medium'}
                      onChange={() => setPriceRange('medium')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{language === 'fr' ? '5 000 - 15 000 XAF' : '5,000 - 15,000 XAF'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'high'}
                      onChange={() => setPriceRange('high')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{language === 'fr' ? 'Plus de 15 000 XAF' : 'More than 15,000 XAF'}</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {language === 'fr'
                  ? `${filteredProducts.length} résultat${filteredProducts.length > 1 ? 's' : ''}`
                  : `${filteredProducts.length} result${filteredProducts.length > 1 ? 's' : ''}`
                }
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="featured">{language === 'fr' ? 'Recommandés' : 'Featured'}</option>
                <option value="price-asc">{language === 'fr' ? 'Prix croissant' : 'Price: Low to High'}</option>
                <option value="price-desc">{language === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}</option>
                <option value="rating">{language === 'fr' ? 'Mieux notés' : 'Highest Rated'}</option>
              </select>
            </div>

            {/* Products */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const library = MOCK_LIBRAIRIES.find(l => l.id === product.librarieId);
                return (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) { setShowLoginModal(true); return; }
                          toggleFavorite(product);
                          toast.success(isFavorite(product.id) ? 'Retiré des favoris' : 'Ajouté aux favoris');
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center shadow hover:scale-110 transition-transform"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {CATEGORIES.find(c => c.id === product.categoryId)?.name}
                        </span>
                      </div>

                      {/* Title & Author */}
                      <h3 className="font-semibold mb-1 line-clamp-2">{product.title}</h3>
                      {product.author && (
                        <p className="text-sm text-muted-foreground mb-2">{product.author}</p>
                      )}

                      {/* Description */}
                      {product.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                      )}

                      {/* Library */}
                      {library && (
                        <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">{library.name}</span>
                        </div>
                      )}

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-3">
                      {product.salePrice && (
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(product.salePrice)}
                        </div>
                      )}
                      {product.rentalPricePerDay && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatPrice(product.rentalPricePerDay)}{language === 'fr' ? '/jour' : '/day'}
                        </div>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mb-3">
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {language === 'fr' ? `✓ En stock (${product.stock})` : `✓ In stock (${product.stock})`}
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 dark:text-red-400">
                          {language === 'fr' ? 'Rupture de stock' : 'Out of stock'}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      disabled={product.stock === 0}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-medium">{language === 'fr' ? 'Ajouter au panier' : 'Add to cart'}</span>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{language === 'fr' ? 'Aucun produit trouvé' : 'No products found'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {language === 'fr' ? 'Connexion requise' : 'Login Required'}
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-muted-foreground mb-6">
              {language === 'fr'
                ? 'Vous devez vous connecter pour ajouter des produits au panier.'
                : 'You must be logged in to add products to cart.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={() => navigate('/auth/login')}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === 'fr' ? 'Se connecter' : 'Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Pas encore de compte ?' : "Don't have an account?"}
              </span>
              <button
                onClick={() => navigate('/auth/signup/client')}
                className="ml-2 text-sm text-primary hover:underline"
              >
                {language === 'fr' ? 'Créer un compte' : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
