import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useReviews } from '../context/ReviewsContext';
import { useNotifications } from '../context/NotificationsContext';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { MOCK_LIBRAIRIES, CATEGORIES } from '../data/mockData';
import {
  Star, MapPin, ShoppingCart, Calendar, Package, Truck,
  Shield, ArrowLeft, Heart, Share2, ChevronRight, User, CheckCircle, X, LogIn, FileText, Flag
} from 'lucide-react';
import { toast } from 'sonner';

export function ProductDetailsPageDemo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice, language } = useLocalization();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getProductReviews, addReview } = useReviews();
  const { addNotification } = useNotifications();
  const { products, reportProduct } = useAdminPlatform();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Information incorrecte');
  const [reportDescription, setReportDescription] = useState('');

  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rentDays, setRentDays] = useState(7);
  const [mode, setMode] = useState<'sale' | 'rental' | 'digital'>('sale');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Produit non trouvé</h2>
          <button
            onClick={() => navigate('/catalog')}
            className="text-primary hover:underline"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const library = MOCK_LIBRAIRIES.find(l => l.id === product.librarieId);
  const category = CATEGORIES.find(c => c.id === product.categoryId);
  const relatedProducts = products.filter(
    p => p.available !== false && p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  const productReviews = getProductReviews(product.id);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (user.type !== 'client') {
      toast.error(language === 'fr' ? 'Seul un client peut ajouter au panier.' : 'Only customers can add to cart.');
      return;
    }

    const added = addToCart(product, mode, mode === 'digital' ? 1 : quantity, mode === 'rental' ? rentDays : undefined);
    if (added) {
      toast.success(`"${product.title}" ${language === 'fr' ? 'ajouté au panier !' : 'added to cart!'}`);
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    toggleFavorite(product);
    toast.success(isFavorite(product.id)
      ? (language === 'fr' ? 'Retiré des favoris' : 'Removed from favorites')
      : (language === 'fr' ? 'Ajouté aux favoris !' : 'Added to favorites!'));
  };

  const handleSubmitReview = () => {
    if (!user) { setShowLoginModal(true); return; }
    if (!reviewComment.trim()) return;
    addReview({
      userId: user.id,
      userName: user.name || user.email || 'Client',
      productId: product.id,
      productTitle: product.title,
      libraryId: product.librarieId,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewComment('');
    setReviewRating(5);
    setShowReviewForm(false);
    addNotification({
      type: 'review_published',
      title: language === 'fr' ? '⭐ Avis publié' : '⭐ Review published',
      message: language === 'fr'
        ? `Votre avis sur "${product.title}" a été publié avec succès.`
        : `Your review of "${product.title}" was published successfully.`,
      link: `/products/${product.id}`,
    });
    toast.success(language === 'fr' ? 'Avis publié avec succès !' : 'Review published!');
  };

  const handleSubmitReport = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (user.type !== 'client') {
      toast.error(language === 'fr' ? 'Seuls les clients peuvent signaler un livre.' : 'Only customers can report a book.');
      return;
    }
    if (!reportDescription.trim()) {
      toast.error(language === 'fr' ? 'Expliquez brièvement le problème.' : 'Please describe the problem.');
      return;
    }
    reportProduct({
      reporterId: user.id,
      reporterName: user.name || user.email || 'Client',
      productId: product.id,
      productTitle: product.title,
      libraryId: product.librarieId,
      reason: reportReason,
      description: reportDescription.trim(),
    });
    setReportDescription('');
    setReportReason('Information incorrecte');
    setShowReportModal(false);
  };

  const totalPrice = mode === 'sale'
    ? (product.salePrice || 0) * quantity
    : mode === 'digital'
    ? (product.digitalPrice || 0)
    : (product.rentalPricePerDay || 0) * rentDays;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-foreground">
              Accueil
            </button>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => navigate('/catalog')} className="hover:text-foreground">
              Catalogue
            </button>
            <ChevronRight className="w-4 h-4" />
            {category && (
              <>
                <button onClick={() => navigate(`/catalog?category=${category.id}`)} className="hover:text-foreground">
                  {category.name}
                </button>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ Populaire
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleAddToFavorites}
                  className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all transform hover:scale-110"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                </button>
                <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all transform hover:scale-110" title="Partager">
                  <Share2 className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => user ? setShowReportModal(true) : setShowLoginModal(true)}
                  className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all transform hover:scale-110"
                  title={language === 'fr' ? 'Signaler ce livre' : 'Report this book'}
                >
                  <Flag className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary scale-105'
                        : 'border-transparent hover:border-muted-foreground/20'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category badge */}
            {category && (
              <div className="flex items-center gap-2">
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">{category.name}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              {product.author && (
                <p className="text-lg text-muted-foreground">Par {product.author}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviewsCount} avis)
              </span>
            </div>

            {/* Price */}
            <div className="bg-muted/50 rounded-xl p-6">
              {(product.type === 'both' || product.digitalPrice) && (
                <div className="flex gap-2 mb-4">
                  {(product.type === 'sale' || product.type === 'both') && product.salePrice && (
                    <button
                      onClick={() => setMode('sale')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        mode === 'sale'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-gray-800 hover:bg-muted'
                      }`}
                    >
                      {language === 'fr' ? 'Physique' : 'Physical'}
                    </button>
                  )}
                  {product.rentalPricePerDay && (
                    <button
                      onClick={() => setMode('rental')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        mode === 'rental'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-gray-800 hover:bg-muted'
                      }`}
                    >
                      {language === 'fr' ? 'Louer' : 'Rent'}
                    </button>
                  )}
                  {product.digitalPrice && (
                    <button
                      onClick={() => { setMode('digital'); setQuantity(1); }}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        mode === 'digital'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-gray-800 hover:bg-muted'
                      }`}
                    >
                      {language === 'fr' ? 'Numérique' : 'Digital'}
                    </button>
                  )}
                </div>
              )}

              {mode === 'sale' && product.salePrice && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(product.salePrice)}
                  </div>
                  <p className="text-sm text-muted-foreground">Prix d'achat</p>
                </div>
              )}

              {mode === 'rental' && product.rentalPricePerDay && (
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <div className="text-4xl font-bold text-primary">
                      {formatPrice(product.rentalPricePerDay)}
                    </div>
                    <span className="text-muted-foreground">/ jour</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durée de location</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={rentDays}
                      onChange={(e) => setRentDays(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-sm text-muted-foreground">
                      Total: {formatPrice(product.rentalPricePerDay * rentDays)}
                    </p>
                  </div>
                </div>
              )}

              {mode === 'digital' && product.digitalPrice && (
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPrice(product.digitalPrice)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'fr' ? 'Version numérique (PDF)' : 'Digital version (PDF)'}
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          {language === 'fr' ? 'Livraison instantanée' : 'Instant delivery'}
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          {language === 'fr'
                            ? 'Le fichier PDF sera disponible immédiatement après achat dans "Mes PDFs"'
                            : 'PDF file will be available immediately after purchase in "My PDFs"'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stock - Only for physical products */}
            {mode !== 'digital' && (
              <div className={`flex items-center gap-2 text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {language === 'fr'
                      ? `En stock (${product.stock} disponible${product.stock > 1 ? 's' : ''})`
                      : `In stock (${product.stock} available)`}
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    {language === 'fr' ? 'Rupture de stock' : 'Out of stock'}
                  </>
                )}
              </div>
            )}

            {/* Stock info for digital products */}
            {mode === 'digital' && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle className="w-5 h-5" />
                {language === 'fr' ? 'Stock illimité' : 'Unlimited stock'}
              </div>
            )}

            {/* Quantity only for physical sale products */}
            {mode === 'sale' && product.stock > 0 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'fr' ? 'Quantité' : 'Quantity'}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            {mode === 'digital' && (
              <div className="rounded-xl border border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4 text-sm text-purple-700 dark:text-purple-300">
                {language === 'fr'
                  ? 'Un PDF correspond à un achat unique : aucune quantité et aucun frais de livraison.'
                  : 'A PDF is a single purchase: no quantity and no shipping fee.'}
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={(mode !== 'digital' && product.stock === 0) || product.available === false}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02]"
            >
              <ShoppingCart className="w-6 h-6" />
              {mode === 'sale'
                ? (language === 'fr' ? 'Ajouter au panier' : 'Add to cart')
                : mode === 'digital'
                ? (language === 'fr' ? 'Acheter (PDF)' : 'Buy (PDF)')
                : (language === 'fr' ? 'Louer ce produit' : 'Rent this product')}
              <span className="ml-2">• {formatPrice(totalPrice)}</span>
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {product.available === false ? (
                  language === 'fr' ? 'Produit retiré' : 'Product removed'
                ) : mode === 'digital' ? (
                <>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">
                      {language === 'fr' ? 'Livraison instantanée' : 'Instant delivery'}
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">
                      {language === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}
                    </p>
                  </div>
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">
                      {language === 'fr' ? 'Format PDF' : 'PDF format'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">
                      {language === 'fr' ? 'Livraison rapide' : 'Fast delivery'}
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">
                      {language === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}
                    </p>
                  </div>
                  <div className="text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium">
                      {language === 'fr' ? 'Retour gratuit' : 'Free return'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {product.isbn && (
                <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                  {product.isbn && (
                    <div>
                      <span className="font-medium">ISBN:</span> {product.isbn}
                    </div>
                  )}
                  {product.publisher && (
                    <div>
                      <span className="font-medium">Éditeur:</span> {product.publisher}
                    </div>
                  )}
                  {product.publicationYear && (
                    <div>
                      <span className="font-medium">Année:</span> {product.publicationYear}
                    </div>
                  )}
                  {product.pages && (
                    <div>
                      <span className="font-medium">Pages:</span> {product.pages}
                    </div>
                  )}
                  {product.language && (
                    <div>
                      <span className="font-medium">Langue:</span> {product.language}
                    </div>
                  )}
                  {product.condition && (
                    <div>
                      <span className="font-medium">État:</span> {product.condition}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {language === 'fr' ? 'Avis clients' : 'Customer Reviews'}
                  {productReviews.length > 0 && (
                    <span className="ml-2 text-base font-normal text-muted-foreground">({productReviews.length})</span>
                  )}
                </h2>
                {!showReviewForm && (
                  <button
                    onClick={() => { if (!user) { setShowLoginModal(true); return; } setShowReviewForm(true); }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    {language === 'fr' ? '+ Laisser un avis' : '+ Write a review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-5 bg-muted/40 rounded-xl border border-border">
                  <h3 className="font-semibold mb-4">{language === 'fr' ? 'Votre avis' : 'Your Review'}</h3>
                  {/* Star rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">{language === 'fr' ? 'Note:' : 'Rating:'}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setReviewRating(star)}>
                          <Star className={`w-6 h-6 cursor-pointer transition-colors ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={language === 'fr' ? 'Partagez votre expérience avec ce produit...' : 'Share your experience with this product...'}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
                  />
                  <div className="flex gap-3 mt-3 justify-end">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    >
                      {language === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={!reviewComment.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {language === 'fr' ? 'Publier' : 'Publish'}
                    </button>
                  </div>
                </div>
              )}

              {productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{review.userName || 'Client'}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'fr' ? 'Aucun avis pour le moment. Soyez le premier à donner votre avis !' : 'No reviews yet. Be the first to leave one!'}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Library */}
            {library && (
              <div
                onClick={() => navigate(`/libraries/${library.id}`)}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-all cursor-pointer group"
              >
                <h3 className="font-semibold mb-4">Vendu par</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={library.logo}
                    alt={library.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {library.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{library.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({library.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{library.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Produits similaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => navigate(`/products/${prod.id}`)}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                >
                  <div className="aspect-[3/4] bg-muted overflow-hidden">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {prod.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      {prod.salePrice && (
                        <span className="font-bold text-primary">
                          {formatPrice(prod.salePrice)}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{prod.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flag className="w-6 h-6 text-red-600" />
                {language === 'fr' ? 'Signaler ce livre' : 'Report this book'}
              </h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'fr'
                ? 'Votre signalement sera envoyé à l’administrateur pour vérification.'
                : 'Your report will be sent to the administrator for review.'}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{language === 'fr' ? 'Motif' : 'Reason'}</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Information incorrecte</option>
                  <option>Image trompeuse</option>
                  <option>Prix suspect</option>
                  <option>Livre indisponible</option>
                  <option>Contenu inapproprié</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{language === 'fr' ? 'Description' : 'Description'}</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder={language === 'fr' ? 'Expliquez le problème constaté...' : 'Describe the issue...'}
                />
              </div>
              <button
                onClick={handleSubmitReport}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {language === 'fr' ? 'Envoyer le signalement' : 'Submit report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {language === 'fr' ? 'Connexion requise' : 'Login Required'}
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
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
                className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={() => navigate('/auth/login')}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {language === 'fr' ? 'Se connecter' : 'Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? "Pas encore de compte ?" : "Don't have an account?"}
              </p>
              <button
                onClick={() => navigate('/auth/signup/client')}
                className="text-sm text-primary hover:underline font-medium"
              >
                {language === 'fr' ? "S'inscrire" : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
