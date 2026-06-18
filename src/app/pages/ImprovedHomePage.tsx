import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { LibraryCard } from '../components/LibraryCard';
import { SearchBar } from '../components/SearchBar';
import { Product, Librairie, Category } from '../types';
import { useAPI } from '../hooks/useAPI';
import { useCart } from '../context/CartContext';
import { MapPin, TrendingUp, Star, Award } from 'lucide-react';
import { toast } from 'sonner';

export function ImprovedHomePage() {
  const navigate = useNavigate();
  const { get } = useAPI();
  const { addToCart } = useCart();

  const [nearbyLibraries, setNearbyLibraries] = useState<Librairie[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getUserLocation();
    loadData();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Yaoundé, Cameroon
          setUserLocation({ lat: 3.8480, lng: 11.5021 });
        }
      );
    } else {
      setUserLocation({ lat: 3.8480, lng: 11.5021 });
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData, librariesData] = await Promise.all([
        get('/categories'),
        get('/products?limit=12&sortBy=rating'),
        get('/librairies'),
      ]);

      setCategories(categoriesData.categories || []);
      setPopularProducts((productsData.products || []).slice(0, 6));
      setNewProducts((productsData.products || []).slice(6, 12));
      setNearbyLibraries((librariesData.librairies || []).slice(0, 4));
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Échec du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: Category) =>
    typeof category.name === 'string' ? category.name : category.name.fr;

  const handleSearch = (query: string) => {
    navigate(`/catalog?q=${encodeURIComponent(query)}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.type === 'rental' ? 'rental' : 'sale');
    toast.success('Produit ajouté au panier');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trouvez les meilleurs livres et fournitures
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Des milliers de produits disponibles à l'achat ou en location dans les librairies près de chez vous
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Rechercher des livres, fournitures..."
                showFilters={false}
              />
            </div>
          </div>

          {userLocation && (
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              <span>Localisation détectée - Affichage des librairies proches</span>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Catégories populaires</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.slice(0, 7).map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/catalog?category=${category.id}`)}
              className="bg-card hover:shadow-lg transition-all rounded-lg p-6 border border-border flex flex-col items-center gap-3 group"
            >
              <span className="text-4xl">{category.icon}</span>
              <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {getCategoryName(category)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Libraries */}
      {nearbyLibraries.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Librairies près de vous</h2>
            </div>
            <button
              onClick={() => navigate('/libraries')}
              className="text-primary hover:underline font-medium"
            >
              Voir toutes
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyLibraries.map((library) => (
              <LibraryCard
                key={library.id}
                library={library}
                onClick={() => navigate(`/libraries/${library.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Products */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Produits populaires</h2>
            </div>
            <button
              onClick={() => navigate('/catalog?sortBy=rating')}
              className="text-primary hover:underline font-medium"
            >
              Voir tous
            </button>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg h-96 animate-pulse border border-border"
                />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Nouveautés</h2>
          </div>
          <button
            onClick={() => navigate('/catalog?sortBy=newest')}
            className="text-primary hover:underline font-medium"
          >
            Voir tous
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg h-96 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-accent text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Vous êtes libraire ?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et touchez des milliers de clients potentiels. Gérez votre inventaire, vos commandes et vos locations en toute simplicité.
          </p>
          <button
            onClick={() => navigate('/librairie/dashboard')}
            className="bg-white text-accent px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Devenir partenaire
          </button>
        </div>
      </div>
    </div>
  );
}
