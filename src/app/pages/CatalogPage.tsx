import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { FiltersSidebar } from '../components/FiltersSidebar';
import { SearchBar } from '../components/SearchBar';
import { Product, Category } from '../types';
import { useAPI } from '../hooks/useAPI';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';

export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { get } = useAPI();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { language } = useLocalization();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const data = await get('/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const query = searchParams.get('q') || '';
      const categoryId = searchParams.get('category') || '';
      const sortBy = searchParams.get('sort') || 'relevance';

      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (categoryId) params.append('categoryId', categoryId);
      if (sortBy) params.append('sortBy', sortBy);

      const data = await get(`/products?${params.toString()}`);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Échec du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    navigate(`/catalog?${params.toString()}`);
  };

  const handleApplyFilters = (filters: any) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.set(key, filters[key].toString());
      } else {
        params.delete(key);
      }
    });
    navigate(`/catalog?${params.toString()}`);
  };

  const handleFavorite = async (productId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      if (favorites.includes(productId)) {
        await get(`/favorites/${productId}`);
        setFavorites(favorites.filter((id) => id !== productId));
        toast.success(language === 'fr' ? 'Retiré des favoris' : 'Removed from favorites');
      } else {
        await get(`/favorites/${productId}`);
        setFavorites([...favorites, productId]);
        toast.success(language === 'fr' ? 'Ajouté aux favoris' : 'Added to favorites');
      }
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de la mise à jour des favoris' : 'Error updating favorites');
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product, product.type === 'rental' ? 'rental' : 'sale');
    toast.success(language === 'fr' ? 'Produit ajouté au panier' : 'Product added to cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchBar
            onSearch={handleSearch}
            onFilterClick={() => setShowFilters(!showFilters)}
            defaultValue={searchParams.get('q') || ''}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 shrink-0`}
          >
            <FiltersSidebar
              categories={categories}
              onApplyFilters={handleApplyFilters}
              onClose={() => setShowFilters(false)}
            />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                Catalogue ({products.length} produits)
              </h1>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtres
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg h-96 animate-pulse border border-border"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Aucun produit trouvé
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.includes(product.id)}
                    onAddToCart={handleAddToCart}
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                ))}
              </div>
            )}
          </main>
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
                ? 'Vous devez vous connecter pour ajouter des produits au panier ou aux favoris.'
                : 'You must be logged in to add products to cart or favorites.'}
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
