import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS, MOCK_LIBRAIRIES } from '../data/mockData';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package,
  Truck, CreditCard, Shield, Tag, ChevronRight, FileText
} from 'lucide-react';
import { toast } from 'sonner';

export function CartPageDemo() {
  const navigate = useNavigate();
  const { formatPrice, language } = useLocalization();
  const { items, removeFromCart, updateQuantity, updateRentalDays, clearCart } = useCart();

  // Enrich cart items with product data
  const cartItems = items
    .map((item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<(typeof items)[0] & { product: (typeof MOCK_PRODUCTS)[0] }>;

  const handleUpdateQuantity = (productId: string, type: 'sale' | 'rental' | 'digital', newQty: number) => {
    const item = cartItems.find((i) => i.productId === productId && i.type === type);
    if (!item) return;
    if (type === 'digital') {
      updateQuantity(productId, type, 1);
      return;
    }
    const maxStock = item.product.stock;
    const clamped = Math.max(1, Math.min(newQty, maxStock));
    updateQuantity(productId, type, clamped);
    if (newQty > maxStock) {
      toast.warning(language === 'fr' ? `Stock limité à ${maxStock}` : `Stock limited to ${maxStock}`);
    }
  };

  const handleRemove = (productId: string, type: 'sale' | 'rental' | 'digital', name: string) => {
    removeFromCart(productId, type);
    toast.success(language === 'fr' ? `"${name}" retiré du panier` : `"${name}" removed from cart`);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item.type === 'sale'
        ? item.product.salePrice || 0
        : item.type === 'digital'
        ? item.product.digitalPrice || 0
        : (item.product.rentalPricePerDay || 0) * (item.rentalDays || 7);
    return sum + price * (item.type === 'digital' ? 1 : item.quantity);
  }, 0);

  const hasPhysicalItems = cartItems.some((i) => i.type === 'sale' || i.type === 'rental');
  const shipping = hasPhysicalItems ? 2500 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {language === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {language === 'fr'
              ? 'Découvrez nos produits et ajoutez-les à votre panier'
              : 'Discover our products and add them to your cart'}
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            {language === 'fr' ? 'Explorer le catalogue' : 'Browse catalog'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ShoppingCart className="w-10 h-10 text-primary" />
              {language === 'fr' ? 'Mon Panier' : 'My Cart'}
            </h1>
            <p className="text-muted-foreground">
              {cartItems.length}{' '}
              {language === 'fr'
                ? `article${cartItems.length > 1 ? 's' : ''} dans votre panier`
                : `item${cartItems.length > 1 ? 's' : ''} in your cart`}
            </p>
          </div>
          <button
            onClick={() => {
              clearCart();
              toast.success(language === 'fr' ? 'Panier vidé' : 'Cart cleared');
            }}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            {language === 'fr' ? 'Vider le panier' : 'Clear cart'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const library = MOCK_LIBRAIRIES.find((l) => l.id === item.product.librarieId);
              const itemPrice =
                item.type === 'sale'
                  ? item.product.salePrice || 0
                  : item.type === 'digital'
                  ? item.product.digitalPrice || 0
                  : (item.product.rentalPricePerDay || 0) * (item.rentalDays || 7);

              return (
                <div
                  key={`${item.productId}-${item.type}`}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative flex gap-4 sm:gap-6">
                    {/* Image */}
                    <div
                      onClick={() => navigate(`/products/${item.product.id}`)}
                      className="w-24 h-32 sm:w-32 sm:h-40 bg-muted rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group-hover:ring-2 ring-primary transition-all"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3
                            className="font-bold text-lg cursor-pointer hover:text-primary transition-colors line-clamp-2"
                            onClick={() => navigate(`/products/${item.product.id}`)}
                          >
                            {item.product.title}
                          </h3>
                          {item.product.author && (
                            <p className="text-sm text-muted-foreground">{item.product.author}</p>
                          )}
                          {library && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <ChevronRight className="w-3 h-3" />
                              {library.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId, item.type, item.product.title)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-all flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Mode badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            item.type === 'sale'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : item.type === 'digital'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}
                        >
                          {item.type === 'sale' ? (
                            <>
                              <Package className="w-3 h-3" />
                              {language === 'fr' ? 'Achat' : 'Purchase'}
                            </>
                          ) : item.type === 'digital' ? (
                            <>
                              <FileText className="w-3 h-3" />
                              {language === 'fr' ? 'Numérique (PDF)' : 'Digital (PDF)'}
                            </>
                          ) : (
                            <>
                              <Tag className="w-3 h-3" />
                              {language === 'fr' ? 'Location' : 'Rental'}
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-3">
                          {/* Quantity only for physical sale products. PDF is always one file/license. */}
                          {item.type === 'sale' && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {language === 'fr' ? 'Qté:' : 'Qty:'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.productId, item.type, item.quantity - 1)
                                  }
                                  className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-all flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={item.product.stock}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val)) handleUpdateQuantity(item.productId, item.type, val);
                                  }}
                                  className="w-14 px-2 py-1 bg-background border border-border rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                                />
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.productId, item.type, item.quantity + 1)
                                  }
                                  className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-all flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({item.product.stock} {language === 'fr' ? 'en stock' : 'in stock'})
                              </span>
                            </div>
                          )}

                          {item.type === 'digital' && (
                            <div className="text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg px-3 py-2">
                              {language === 'fr'
                                ? 'PDF : achat unique, sans quantité ni livraison.'
                                : 'PDF: single purchase, no quantity and no shipping.'}
                            </div>
                          )}

                          {/* Rental days */}
                          {item.type === 'rental' && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {language === 'fr' ? 'Durée:' : 'Duration:'}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateRentalDays(item.productId, (item.rentalDays || 7) - 1)
                                  }
                                  className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-all flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max="90"
                                  value={item.rentalDays || 7}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val >= 1)
                                      updateRentalDays(item.productId, val);
                                  }}
                                  className="w-14 px-2 py-1 bg-background border border-border rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                                />
                                <button
                                  onClick={() =>
                                    updateRentalDays(item.productId, (item.rentalDays || 7) + 1)
                                  }
                                  className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-all flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {language === 'fr' ? 'jours' : 'days'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {formatPrice(itemPrice * (item.type === 'digital' ? 1 : item.quantity))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatPrice(itemPrice)}
                            {item.type === 'rental'
                              ? `/${language === 'fr' ? 'j' : 'd'} × ${item.quantity}`
                              : item.type === 'sale'
                              ? ` × ${item.quantity}`
                              : language === 'fr' ? ' • PDF' : ' • PDF'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <button
              onClick={() => navigate('/catalog')}
              className="w-full py-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-primary font-medium"
            >
              <Plus className="w-5 h-5" />
              {language === 'fr' ? "Ajouter d'autres produits" : 'Add more products'}
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'fr' ? 'Résumé de la commande' : 'Order Summary'}
                </h3>

                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{language === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {language === 'fr' ? 'Livraison' : 'Shipping'}
                    </span>
                    <span className="font-medium">
                      {shipping === 0
                        ? language === 'fr'
                          ? 'Gratuit'
                          : 'Free'
                        : formatPrice(shipping)}
                    </span>
                  </div>
                  {!hasPhysicalItems && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {language === 'fr'
                        ? 'Aucun frais pour les produits numériques'
                        : 'No fees for digital products'}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                >
                  {language === 'fr' ? 'Commander' : 'Checkout'}
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto mb-1 text-green-600" />
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}
                    </p>
                  </div>
                  <div className="text-center">
                    <Truck className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Livraison rapide' : 'Fast delivery'}
                    </p>
                  </div>
                  <div className="text-center">
                    <CreditCard className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Paiement flexible' : 'Flexible payment'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-6">
                <h4 className="font-semibold mb-3 text-sm">
                  {language === 'fr' ? 'Modes de paiement acceptés' : 'Accepted payment methods'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['MTN Mobile Money', 'Orange Money', language === 'fr' ? 'Carte Bancaire' : 'Credit Card', language === 'fr' ? 'Portefeuille' : 'Wallet', language === 'fr' ? 'Espèces' : 'Cash'].map(
                    (method) => (
                      <span
                        key={method}
                        className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium border border-border"
                      >
                        {method}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
