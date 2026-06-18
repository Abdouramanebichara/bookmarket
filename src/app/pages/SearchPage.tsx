import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { CATEGORIES, MOCK_LIBRAIRIES } from '../data/mockData';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { useProductRequests } from '../context/ProductRequestsContext';
import { searchProductsAndLibraries, SearchResult } from '../utils/search';
import { SlidersHorizontal, MapPin, Search, X, Heart, Star, Plus, Building2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, formatPrice } = useLocalization();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { visibleProducts } = useAdminPlatform();
  const { createRequest } = useProductRequests();

  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [resultType, setResultType] = useState<'all' | 'product' | 'library'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [requestDescription, setRequestDescription] = useState('');
  const [requestBudget, setRequestBudget] = useState('');

  const rawResults = useMemo(
    () => searchProductsAndLibraries({
      query: queryParam,
      products: visibleProducts,
      libraries: MOCK_LIBRAIRIES,
      categories: CATEGORIES,
    }),
    [queryParam, visibleProducts]
  );

  const results = useMemo(() => {
    let list = rawResults.filter((result) => {
      if (resultType !== 'all' && result.kind !== resultType) return false;
      if (categoryFilter !== 'all' && result.kind === 'product' && result.item.categoryId !== categoryFilter) return false;
      if (categoryFilter !== 'all' && result.kind === 'library') return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => getResultPrice(a) - getResultPrice(b));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => getResultPrice(b) - getResultPrice(a));
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => getResultRating(b) - getResultRating(a));
    } else {
      list = [...list].sort((a, b) => b.score - a.score);
    }

    return list;
  }, [rawResults, resultType, categoryFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleCreateProductRequest = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const title = queryParam.trim() || query.trim();
    if (!title) return;
    createRequest({
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      title,
      description: requestDescription.trim() || undefined,
      budget: requestBudget ? Number(requestBudget) : undefined,
      city: user.city || 'Yaoundé',
      urgency: 'normal',
    });
    setRequestDescription('');
    setRequestBudget('');
  };

  const handleAddToCart = (productId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const product = visibleProducts.find((item) => item.id === productId);
    if (!product) return;

    const mode: 'sale' | 'rental' | 'digital' = product.salePrice ? 'sale' : product.digitalPrice ? 'digital' : 'rental';
    const added = addToCart(product, mode, 1, mode === 'rental' ? 7 : undefined);
    if (added) toast.success(language === 'fr' ? 'Produit ajouté au panier !' : 'Product added to cart!');
  };

  const handleToggleFavorite = (productId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const product = visibleProducts.find((item) => item.id === productId);
    if (!product) return;

    const wasFavorite = isFavorite(productId);
    toggleFavorite(product);
    toast.success(
      wasFavorite
        ? (language === 'fr' ? 'Retiré des favoris' : 'Removed from favorites')
        : (language === 'fr' ? 'Ajouté aux favoris' : 'Added to favorites')
    );
  };

  const productCount = results.filter((result) => result.kind === 'product').length;
  const libraryCount = results.filter((result) => result.kind === 'library').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 sm:pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1B3E] mb-4">
            {language === 'fr' ? 'Recherche' : 'Search'}
          </h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher un livre, une librairie, un auteur...' : 'Search for a book, bookstore, author...'}
                className="w-full pl-12 pr-32 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#0D1B3E] text-white rounded-lg hover:bg-[#0D1B3E]/90 transition-colors font-medium"
              >
                {language === 'fr' ? 'Rechercher' : 'Search'}
              </button>
            </div>
          </form>

          <p className="text-gray-600">
            {queryParam
              ? language === 'fr'
                ? `Résultats pour "${queryParam}" : ${results.length} résultat(s), dont ${productCount} produit(s) et ${libraryCount} librairie(s)`
                : `Results for "${queryParam}": ${results.length} result(s), including ${productCount} product(s) and ${libraryCount} bookstore(s)`
              : language === 'fr'
                ? 'Produits recommandés en attendant votre recherche'
                : 'Recommended products until you search'}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {language === 'fr' ? 'Filtres' : 'Filters'}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
          >
            <option value="relevance">{language === 'fr' ? 'Pertinence' : 'Relevance'}</option>
            <option value="price-asc">{language === 'fr' ? 'Prix croissant' : 'Price: Low to High'}</option>
            <option value="price-desc">{language === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}</option>
            <option value="rating">{language === 'fr' ? 'Mieux notés' : 'Highest Rated'}</option>
          </select>

          <select
            value={resultType}
            onChange={(e) => setResultType(e.target.value as 'all' | 'product' | 'library')}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
          >
            <option value="all">{language === 'fr' ? 'Tout' : 'All'}</option>
            <option value="product">{language === 'fr' ? 'Produits' : 'Products'}</option>
            <option value="library">{language === 'fr' ? 'Librairies' : 'Bookstores'}</option>
          </select>
        </div>

        {showFilters && (
          <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-5">
            <p className="font-semibold text-[#0D1B3E] mb-3">{language === 'fr' ? 'Catégorie' : 'Category'}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-full border ${categoryFilter === 'all' ? 'bg-[#0D1B3E] text-white' : 'bg-white text-gray-700'}`}
              >
                {language === 'fr' ? 'Toutes' : 'All'}
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`px-4 py-2 rounded-full border ${categoryFilter === category.id ? 'bg-[#0D1B3E] text-white' : 'bg-white text-gray-700'}`}
                >
                  {category.icon} {typeof category.name === 'string' ? category.name : category.name[language]}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 text-center">
            <Search className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
            </h2>
            <p className="text-gray-500 mb-6">
              {language === 'fr'
                ? 'Le produit recherché n’est pas disponible. Vous pouvez envoyer une demande à toutes les librairies.'
                : 'The requested product is not available. You can send a request to all bookstores.'}
            </p>
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-4">
              <input
                type="number"
                value={requestBudget}
                onChange={(e) => setRequestBudget(e.target.value)}
                placeholder={language === 'fr' ? 'Budget indicatif (FCFA)' : 'Indicative budget (XAF)'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E]"
              />
              <button
                type="button"
                onClick={handleCreateProductRequest}
                className="w-full px-4 py-3 bg-[#0D1B3E] text-white rounded-xl font-semibold hover:bg-[#0D1B3E]/90"
              >
                {language === 'fr' ? 'Demander aux librairies' : 'Request from bookstores'}
              </button>
              <textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder={language === 'fr' ? 'Détails : auteur, édition, niveau, quantité...' : 'Details: author, edition, level, quantity...'}
                className="sm:col-span-2 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] min-h-24"
              />
            </div>
            <button type="button" onClick={() => navigate('/product-requests')} className="text-sm text-[#0D1B3E] hover:underline">
              {language === 'fr' ? 'Voir mes demandes envoyées' : 'View my sent requests'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((result) => result.kind === 'product'
              ? renderProductResult(result, { navigate, formatPrice, language, handleAddToCart, handleToggleFavorite, isFavorite })
              : renderLibraryResult(result, { navigate, language })
            )}
          </div>
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {language === 'fr' ? 'Connexion requise' : 'Login Required'}
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-muted-foreground mb-6">
              {language === 'fr'
                ? 'Vous devez vous connecter pour ajouter des produits au panier ou aux favoris.'
                : 'You must be logged in to add products to cart or favorites.'}
            </p>

            <div className="flex gap-3">
              <button onClick={() => setShowLoginModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button onClick={() => navigate('/auth/login')} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {language === 'fr' ? 'Se connecter' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getResultPrice(result: SearchResult): number {
  if (result.kind === 'library') return Number.MAX_SAFE_INTEGER;
  return result.item.salePrice || result.item.digitalPrice || result.item.rentalPricePerDay || Number.MAX_SAFE_INTEGER;
}

function getResultRating(result: SearchResult): number {
  return result.kind === 'product' ? result.item.rating : result.item.rating;
}

function renderProductResult(
  result: Extract<SearchResult, { kind: 'product' }>,
  helpers: {
    navigate: ReturnType<typeof useNavigate>;
    formatPrice: (price: number) => string;
    language: string;
    handleAddToCart: (productId: string) => void;
    handleToggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
  }
) {
  const { item: product } = result;
  const library = MOCK_LIBRAIRIES.find((lib) => lib.id === product.librarieId);
  const price = product.salePrice || product.digitalPrice || product.rentalPricePerDay || 0;

  return (
    <div
      key={`product-${product.id}`}
      onClick={() => helpers.navigate(`/products/${product.id}`)}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 left-4 bg-white/90 text-[#0D1B3E] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {helpers.language === 'fr' ? 'Produit' : 'Product'}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            helpers.handleToggleFavorite(product.id);
          }}
          className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all ${helpers.isFavorite(product.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600'}`}
        >
          <Heart className={`w-5 h-5 ${helpers.isFavorite(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 h-12">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.author || (helpers.language === 'fr' ? 'Auteur non renseigné' : 'Unknown author')}</p>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {library?.name || 'BookStore'}
        </p>

        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900 text-sm">{product.rating}</span>
          <span className="text-gray-400 text-xs">({product.reviewsCount})</span>
          {result.reasons.length > 0 && <span className="text-xs text-gray-400 ml-auto">{result.reasons.slice(0, 2).join(', ')}</span>}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-xl text-[#0D1B3E]">{helpers.formatPrice(price)}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            helpers.handleAddToCart(product.id);
          }}
          className="w-full py-3 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0f] hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {helpers.language === 'fr' ? 'Ajouter' : 'Add'}
        </button>
      </div>
    </div>
  );
}

function renderLibraryResult(
  result: Extract<SearchResult, { kind: 'library' }>,
  helpers: { navigate: ReturnType<typeof useNavigate>; language: string }
) {
  const { item: library } = result;
  return (
    <div
      key={`library-${library.id}`}
      onClick={() => helpers.navigate(`/libraries/${library.id}`)}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img src={library.coverImage || library.banner || library.logo} alt={library.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 left-4 bg-[#0D1B3E]/90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          {helpers.language === 'fr' ? 'Librairie' : 'Bookstore'}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 h-12">{library.name}</h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {library.address || library.location.address}
        </p>
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900 text-sm">{library.rating}</span>
          <span className="text-gray-400 text-xs">({library.reviewsCount})</span>
          {library.verified && <span className="ml-auto text-xs text-green-600 font-semibold">✓ {helpers.language === 'fr' ? 'Vérifiée' : 'Verified'}</span>}
        </div>
        <button className="w-full py-3 bg-[#0D1B3E] text-white font-semibold rounded-xl hover:bg-[#0D1B3E]/90 transition-all">
          {helpers.language === 'fr' ? 'Voir la librairie' : 'View bookstore'}
        </button>
      </div>
    </div>
  );
}
