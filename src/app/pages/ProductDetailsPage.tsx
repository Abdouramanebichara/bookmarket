import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, MapPin, Store } from 'lucide-react';
import { Product, Review, Librairie } from '../types';
import { useAPI } from '../hooks/useAPI';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get } = useAPI();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [librairie, setLibrairie] = useState<Librairie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(7);
  const [purchaseType, setPurchaseType] = useState<'sale' | 'rental'>('sale');

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const productData = await get(`/products/${id}`);
      setProduct(productData.product);

      if (productData.product.type === 'rental') {
        setPurchaseType('rental');
      }

      const librairieData = await get(`/librairies/${productData.product.librarieId}`);
      setLibrairie(librairieData.librairie);

      const reviewsData = await get(`/reviews?targetType=product&targetId=${id}`);
      setReviews(reviewsData.reviews || []);

      const relatedData = await get(
        `/products?categoryId=${productData.product.categoryId}&limit=4`
      );
      setRelatedProducts(
        (relatedData.products || []).filter((p: Product) => p.id !== id)
      );
    } catch (error) {
      console.error('Failed to load product details:', error);
      toast.error('Échec du chargement des détails du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, purchaseType, quantity, purchaseType === 'rental' ? rentalDays : undefined);
    toast.success('Produit ajouté au panier');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-4">
              <img
                src={product.images[selectedImage] || 'https://via.placeholder.com/600x800'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      i === selectedImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            {product.author && (
              <p className="text-lg text-muted-foreground mb-4">par {product.author}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({product.reviewsCount} avis)
                  </span>
                </div>
              )}
              {product.condition && (
                <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                  {product.condition}
                </span>
              )}
            </div>

            {product.type === 'both' && (
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPurchaseType('sale')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    purchaseType === 'sale'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Acheter
                </button>
                <button
                  onClick={() => setPurchaseType('rental')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    purchaseType === 'rental'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Louer
                </button>
              </div>
            )}

            <div className="bg-card rounded-lg p-6 border border-border mb-6">
              {purchaseType === 'sale' && product.salePrice ? (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Prix d'achat</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatPrice(product.salePrice)}
                  </p>
                </div>
              ) : purchaseType === 'rental' && product.rentalPricePerDay ? (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Prix de location</p>
                  <p className="text-4xl font-bold text-accent">
                    {formatPrice(product.rentalPricePerDay)}/jour
                  </p>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Durée de location (jours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rentalDays}
                      onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Total: {formatPrice(product.rentalPricePerDay * rentalDays)}
                    </p>
                  </div>
                </div>
              ) : null}

              {product.available ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Quantité</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.min(product.stock, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-20 text-center px-4 py-2 border border-border rounded-lg"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
                      >
                        +
                      </button>
                      <span className="text-sm text-muted-foreground ml-2">
                        {product.stock} disponibles
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 mb-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Ajouter au panier
                  </button>
                </>
              ) : (
                <div className="text-center py-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive font-semibold">Rupture de stock</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 border border-border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary">
                  <Heart className="w-5 h-5" />
                  Favoris
                </button>
                <button className="flex-1 border border-border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary">
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
              </div>
            </div>

            {librairie && (
              <div
                onClick={() => navigate(`/libraries/${librairie.id}`)}
                className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Store className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{librairie.name}</h3>
                    {librairie.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{librairie.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{librairie.location.city}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-foreground whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Avis clients</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {review.userAvatar ? (
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-semibold">
                          {review.userName[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="font-medium mb-2">{review.title}</h4>
                      )}
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Produits similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                  className="bg-card rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-border"
                >
                  <div className="aspect-[3/4] bg-muted">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold line-clamp-2 mb-1">
                      {relatedProduct.title}
                    </h3>
                    {relatedProduct.salePrice && (
                      <p className="text-primary font-bold">
                        {formatPrice(relatedProduct.salePrice)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
