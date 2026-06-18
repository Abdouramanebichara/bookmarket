import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MOCK_LIBRAIRIES, CATEGORIES } from '../data/mockData';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import {
  MapPin, TrendingUp, Star, Award, ArrowRight, Sparkles,
  Clock, Package, ShoppingCart, Calendar, ChevronRight, Zap
} from 'lucide-react';
import { toast } from 'sonner';

export function ImprovedHomePageDemo() {
  const navigate = useNavigate();
  const { formatPrice, t, language } = useLocalization();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { visibleProducts } = useAdminPlatform();

  // Données simulées
  const popularProducts = visibleProducts.filter(p => p.rating >= 4.7).slice(0, 6);
  const newProducts = visibleProducts.slice(0, 6);
  const nearbyLibraries = MOCK_LIBRAIRIES.slice(0, 4);
  const topCategories = CATEGORIES.slice(0, 8);

  const handleAddToCart = (productId: string) => {
    const product = visibleProducts.find((item) => item.id === productId);
    if (!product) return;
    const mode: 'sale' | 'rental' | 'digital' = product.salePrice ? 'sale' : product.digitalPrice ? 'digital' : 'rental';
    const added = addToCart(product, mode, 1, mode === 'rental' ? 7 : undefined);
    if (added) toast.success(language === 'fr' ? 'Produit ajouté au panier !' : 'Product added to cart!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section avec animation */}
      <div className="relative bg-primary text-primary-foreground overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">La marketplace N°1 au Cameroun</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez vos livres et<br />
              <span className="bg-yellow-500 bg-clip-text text-transparent">
                fournitures scolaires
              </span>
            </h1>

            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Des milliers de produits disponibles à l'achat ou en location dans plus de 11 librairies à Yaoundé
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/catalog')}
                className="group bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
              >
                Explorer le catalogue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/libraries')}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Voir les librairies
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { label: 'Produits', value: '2000+', icon: Package },
              { label: 'Librairies', value: '11', icon: MapPin },
              { label: 'Commandes/mois', value: '500+', icon: ShoppingCart },
              { label: 'Clients satisfaits', value: '98%', icon: Star },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catégories Populaires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{language === 'fr' ? 'Catégories Populaires' : 'Popular Categories'}</h2>
            <p className="text-muted-foreground">{language === 'fr' ? 'Explorez nos différentes catégories' : 'Explore our different categories'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topCategories.map((category, idx) => (
            <button
              key={category.id}
              onClick={() => navigate(`/catalog?category=${category.id}`)}
              className="group bg-card rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all transform hover:scale-105"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <div className="font-semibold text-sm text-center group-hover:text-primary transition-colors">
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* {language === 'fr' ? 'Produits Populaires' : 'Popular Products'} */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{language === 'fr' ? 'Produits Populaires' : 'Popular Products'}</h2>
                <p className="text-muted-foreground">{language === 'fr' ? 'Les mieux notés par nos clients' : 'Top rated by our customers'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalog?sort=rating')}
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              {language === 'fr' ? 'Voir tout' : 'See all'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((product, idx) => {
              const library = MOCK_LIBRAIRIES.find(l => l.id === product.librarieId);
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Populaire
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {CATEGORIES.find(c => c.id === product.categoryId)?.name}
                      </span>
                    </div>

                    <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>

                    {product.author && (
                      <p className="text-sm text-muted-foreground mb-2">{product.author}</p>
                    )}

                    {product.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    )}

                    {library && (
                      <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{library.name}</span>
                      </div>
                    )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewsCount} avis)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.salePrice && (
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(product.salePrice)}
                        </div>
                      )}
                      {product.rentalPricePerDay && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatPrice(product.rentalPricePerDay)}/j
                        </div>
                      )}
                    </div>
                    <div className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* {language === 'fr' ? 'Nouveautés' : 'New Products'} */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{language === 'fr' ? 'Nouveautés' : 'New Products'}</h2>
                <p className="text-muted-foreground">{language === 'fr' ? 'Derniers produits ajoutés' : 'Latest added products'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/catalog?sort=recent')}
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              {language === 'fr' ? 'Voir tout' : 'See all'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product, idx) => {
              const library = MOCK_LIBRAIRIES.find(l => l.id === product.librarieId);
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Nouveau
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>

                    {product.author && (
                      <p className="text-sm text-muted-foreground mb-2">{product.author}</p>
                    )}

                    {product.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    )}

                    {library && (
                      <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{library.name}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {product.salePrice && (
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(product.salePrice)}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Librairies à proximité */}
      <div className="bg-green-50 dark:bg-green-950/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{language === 'fr' ? 'Librairies à Yaoundé' : 'Libraries in Yaoundé'}</h2>
                <p className="text-muted-foreground">Trouvez la librairie la plus proche</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/libraries')}
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              Voir la carte
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyLibraries.map((library, idx) => (
              <div
                key={library.id}
                onClick={() => navigate(`/libraries/${library.id}`)}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="relative h-32 bg-muted overflow-hidden">
                  <img
                    src={library.banner}
                    alt={library.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={library.logo}
                      alt={library.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                        {library.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{library.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({library.reviewsCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{library.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {library.productsCount} produits
                    </span>
                    <span className="text-primary font-medium">
                      2.5 km →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action — only shown when not logged in */}
      {!user && (
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-primary rounded-3xl p-12 text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="relative">
                <Award className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-4xl font-bold mb-4">
                  Rejoignez des milliers de clients satisfaits
                </h2>
                <p className="text-xl opacity-90 mb-8">
                  Créez votre compte gratuitement et profitez de nos offres exclusives
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/auth/signup/client')}
                    className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all transform hover:scale-105"
                  >
                    Créer un compte
                  </button>
                  <button
                    onClick={() => navigate('/auth/signup/librairie')}
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
                  >
                    Je suis une librairie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
