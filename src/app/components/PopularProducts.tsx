import { useState } from 'react';
import { Heart, Star, Plus, Check, X } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  image: string;
  store: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'BESTSELLER' | 'PROMO' | 'NOUVEAU';
  type: 'vente' | 'location';
  category: string;
}

const categories = ['Tous', 'Livres', 'Calculatrices', 'Stylos', 'Sacs', 'Cahiers'];

const products: Product[] = [
  {
    id: 1,
    name: 'Cahier Oxford A4 - 96 pages',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop',
    store: 'Librairie Excellence',
    price: 2500,
    oldPrice: 3000,
    rating: 4.8,
    reviews: 124,
    badge: 'PROMO',
    type: 'vente',
    category: 'Cahiers',
  },
  {
    id: 2,
    name: 'Calculatrice Scientifique Casio',
    image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2c8?w=400&h=400&fit=crop',
    store: 'Papeterie Moderna',
    price: 15000,
    rating: 4.9,
    reviews: 89,
    badge: 'BESTSELLER',
    type: 'vente',
    category: 'Calculatrices',
  },
  {
    id: 3,
    name: 'Lot de 10 Stylos BIC',
    image: 'https://images.unsplash.com/photo-1586282023692-c40b78c4c395?w=400&h=400&fit=crop',
    store: 'Les Quatre Vents',
    price: 1500,
    rating: 4.7,
    reviews: 256,
    type: 'vente',
    category: 'Stylos',
  },
  {
    id: 4,
    name: 'Sac à dos Eastpak',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    store: 'BookStore Premium',
    price: 35000,
    oldPrice: 45000,
    rating: 4.9,
    reviews: 178,
    badge: 'PROMO',
    type: 'vente',
    category: 'Sacs',
  },
  {
    id: 5,
    name: 'Compas Géométrie Professionnel',
    image: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=400&fit=crop',
    store: 'Papeterie Scolaire',
    price: 3500,
    rating: 4.5,
    reviews: 67,
    type: 'vente',
    category: 'Tous',
  },
  {
    id: 7,
    name: 'Pack 6 Surligneurs',
    image: 'https://images.unsplash.com/photo-1594910698363-5d44e0ef7d6e?w=400&h=400&fit=crop',
    store: 'Les Quatre Vents',
    price: 2000,
    rating: 4.8,
    reviews: 189,
    type: 'vente',
    category: 'Tous',
  },
  {
    id: 8,
    name: 'Roman "L\'Étranger" - Camus',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop',
    store: 'Librairie Excellence',
    price: 4500,
    rating: 5.0,
    reviews: 312,
    badge: 'BESTSELLER',
    type: 'vente',
    category: 'Livres',
  },
  {
    id: 9,
    name: 'Calculatrice Graph 35+E (Location/mois)',
    image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2c8?w=400&h=400&fit=crop',
    store: 'Papeterie Moderna',
    price: 5000,
    rating: 4.8,
    reviews: 45,
    type: 'location',
    category: 'Calculatrices',
  },
  {
    id: 10,
    name: 'Microscope scolaire (Location/mois)',
    image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400&h=400&fit=crop',
    store: 'Les Quatre Vents',
    price: 10000,
    rating: 4.8,
    reviews: 19,
    badge: 'PROMO',
    type: 'location',
    category: 'Tous',
  },
  {
    id: 14,
    name: 'Kit instruments géométrie (Location/mois)',
    image: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=400&fit=crop',
    store: 'Librairie Excellence',
    price: 3000,
    rating: 4.5,
    reviews: 28,
    type: 'location',
    category: 'Tous',
  },
];

export function PopularProducts() {
  const context = useOutletContext<{ setSelectedProduct?: (product: any) => void }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLocalization();
  const [selectedType, setSelectedType] = useState<'vente' | 'location'>('vente');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleFavorite = (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (id: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const newCart = new Set(addedToCart);
    newCart.add(id);
    setAddedToCart(newCart);
    toast.success(language === 'fr' ? 'Produit ajouté au panier !' : 'Product added to cart!');
    setTimeout(() => {
      const updatedCart = new Set(addedToCart);
      updatedCart.delete(id);
      setAddedToCart(updatedCart);
    }, 2000);
  };

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'BESTSELLER':
        return 'bg-[#0D1B3E] text-white';
      case 'PROMO':
        return 'bg-[#F97316] text-white';
      case 'NOUVEAU':
        return 'bg-purple-600 text-white';
      default:
        return '';
    }
  };

  const filteredProducts = products.filter((product) => {
    const typeMatch = product.type === selectedType;
    const categoryMatch = selectedCategory === 'Tous' || product.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h2 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1B3E] mb-2 sm:mb-3">
            Produits populaires
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Les meilleures ventes de nos librairies partenaires
          </p>
        </div>

        {/* Type Selection: Vente / Location */}
        <div className="flex gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedType('vente');
              setSelectedCategory('Tous');
            }}
            className={`flex-1 md:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all ${
              selectedType === 'vente'
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🛒 Vente
          </button>
          <button
            onClick={() => {
              setSelectedType('location');
              setSelectedCategory('Tous');
            }}
            className={`flex-1 md:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all ${
              selectedType === 'location'
                ? 'bg-[#0D1B3E] text-white shadow-lg shadow-[#0D1B3E]/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📦 Location
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold whitespace-nowrap transition-all text-sm sm:text-base ${
                selectedCategory === category
                  ? selectedType === 'vente'
                    ? 'bg-[#F97316] text-white shadow-lg'
                    : 'bg-[#0D1B3E] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => context?.setSelectedProduct?.(product)}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getBadgeStyles(product.badge)}`}>
                      {product.badge}
                    </div>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all group/fav"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      favorites.has(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 group-hover/fav:text-red-500'
                    }`}
                  />
                </button>

                {/* Promo Badge */}
                {product.oldPrice && (
                  <div className="absolute top-4 right-16">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 h-12">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{product.store}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900 text-sm">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-xl text-[#0D1B3E]">
                    {product.price.toLocaleString()} FCFA
                    {product.type === 'location' && (
                      <span className="text-xs text-gray-500 font-normal ml-1">/mois</span>
                    )}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  disabled={addedToCart.has(product.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    addedToCart.has(product.id)
                      ? 'bg-green-500 text-white'
                      : product.type === 'vente'
                      ? 'bg-[#F97316] text-white hover:bg-[#ea6a0f] hover:shadow-lg'
                      : 'bg-[#0D1B3E] text-white hover:bg-[#0D1B3E]/90 hover:shadow-lg'
                  }`}
                >
                  {addedToCart.has(product.id) ? (
                    <>
                      <Check className="w-5 h-5" />
                      {product.type === 'vente' ? 'Ajouté' : 'Réservé'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {product.type === 'vente' ? 'Ajouter' : 'Réserver'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 border-2 border-[#0D1B3E] text-[#0D1B3E] font-semibold rounded-xl hover:bg-[#0D1B3E] hover:text-white transition-all">
            Voir tous les produits
          </button>
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
