import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useWallet } from '../context/WalletContext';
import { useOrders } from '../context/OrdersContext';
import { useRentals } from '../context/RentalsContext';
import { useDigitalBooks } from '../context/DigitalBooksContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationsContext';
import { MOCK_PRODUCTS } from '../data/mockData';
import {
  ShoppingBag, CreditCard, Truck, ArrowLeft, CheckCircle,
  Wallet, Smartphone, Package, FileText, Tag
} from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice, language } = useLocalization();
  const { wallet, deductFromWallet } = useWallet();
  const { addOrder } = useOrders();
  const { addRental } = useRentals();
  const { addDigitalBook } = useDigitalBooks();
  const { addNotification } = useNotifications();
  const { items: cartItems, clearCart } = useCart();

  // Enrich cart items with product data
  const enrichedItems = cartItems
    .map((item) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as Array<(typeof cartItems)[0] & { product: (typeof MOCK_PRODUCTS)[0] }>;

  const getItemPrice = (item: (typeof enrichedItems)[0]) => {
    if (item.type === 'sale') return item.product.salePrice || 0;
    if (item.type === 'digital') return item.product.digitalPrice || 0;
    return (item.product.rentalPricePerDay || 0) * (item.rentalDays || 7);
  };

  const hasPhysicalItems = enrichedItems.some((i) => i.type === 'sale' || i.type === 'rental');
  const shipping = hasPhysicalItems ? 2500 : 0;
  const subtotal = enrichedItems.reduce((sum, item) => sum + getItemPrice(item) * (item.type === 'digital' ? 1 : item.quantity), 0);
  const totalAmount = subtotal + shipping;
  const checkoutSteps = hasPhysicalItems ? ['shipping', 'payment', 'confirmation'] as const : ['payment', 'confirmation'] as const;

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>(hasPhysicalItems ? 'shipping' : 'payment');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Yaoundé',
    country: user?.country || 'Cameroun',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mobile' | 'card' | 'cash'>('wallet');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'mtn' | 'orange'>('mtn');

  const hasSufficientBalance = wallet && wallet.balance >= totalAmount;

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'wallet') {
      if (!hasSufficientBalance) {
        toast.error(language === 'fr' ? 'Solde insuffisant dans votre portefeuille' : 'Insufficient wallet balance');
        return;
      }
      try {
        await deductFromWallet(totalAmount, language === 'fr' ? 'Achat de produits' : 'Product purchase', {
          items: enrichedItems.map((i) => i.product.title).join(', '),
        });
      } catch {
        toast.error(language === 'fr' ? 'Erreur lors du paiement' : 'Payment error');
        return;
      }
    }

    if (paymentMethod === 'mobile' && !mobileMoneyNumber) {
      toast.error(language === 'fr' ? 'Veuillez entrer votre numéro de téléphone' : 'Please enter your phone number');
      return;
    }

    const newOrderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(newOrderNumber);

    addOrder({
      items: enrichedItems.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        image: item.product.images[0],
        quantity: item.quantity,
        price: getItemPrice(item),
        mode: item.type,
      })),
      subtotal,
      shipping,
      total: totalAmount,
      paymentMethod,
      shippingAddress: shippingInfo.address
        ? `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}`
        : undefined,
    });

    // Create rental entries for rental items
    const rentalItems = enrichedItems.filter(i => i.type === 'rental');
    rentalItems.forEach((item) => {
      const days = item.rentalDays || 7;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      addRental({
        productId: item.productId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days,
        totalAmount: getItemPrice(item) * item.quantity,
        pricePerDay: item.product.rentalPricePerDay || 0,
        libraryId: item.product.librarieId || '',
      });
    });

    // Create digital book entries for digital items
    const digitalItems = enrichedItems.filter(i => i.type === 'digital');
    digitalItems.forEach((item) => {
      addDigitalBook({
        productId: item.productId,
        title: item.product.title,
        author: item.product.author,
        coverImage: item.product.images[0],
        fileSize: 3000000,
        pageCount: item.product.pages || 200,
        format: 'PDF',
        fileUrl: item.product.pdfUrl || `/pdfs/${item.product.id}.pdf`,
      });
    });

    // Notification : commande confirmée
    const saleCount = enrichedItems.filter(i => i.type === 'sale').length;
    if (saleCount > 0 || enrichedItems.length > 0) {
      addNotification({
        type: 'order_confirmed',
        title: language === 'fr' ? '✅ Commande confirmée' : '✅ Order confirmed',
        message: language === 'fr'
          ? `Votre commande de ${enrichedItems.length} article(s) a été passée avec succès.`
          : `Your order of ${enrichedItems.length} item(s) was placed successfully.`,
        link: '/orders',
      });
    }

    // Notification : location démarrée
    rentalItems.forEach((item) => {
      const days = item.rentalDays || 7;
      addNotification({
        type: 'rental_started',
        title: language === 'fr' ? '📦 Location démarrée' : '📦 Rental started',
        message: language === 'fr'
          ? `Votre location de "${item.product.title}" a débuté. Retour prévu dans ${days} jours.`
          : `Your rental of "${item.product.title}" has started. Return in ${days} days.`,
        link: '/rentals',
      });
    });

    // Notification : livre numérique disponible
    digitalItems.forEach((item) => {
      addNotification({
        type: 'digital_available',
        title: language === 'fr' ? '📄 Livre numérique disponible' : '📄 Digital book available',
        message: language === 'fr'
          ? `"${item.product.title}" est disponible dans votre bibliothèque numérique.`
          : `"${item.product.title}" is available in your digital library.`,
        link: '/digital-library',
      });
    });

    clearCart();
    setOrderPlaced(true);
    setStep('confirmation');
    toast.success(language === 'fr' ? 'Commande passée avec succès !' : 'Order placed successfully!');
  };

  if (enrichedItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            {language === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'fr' ? 'Ajoutez des produits avant de passer à la caisse' : 'Add products before checking out'}
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {language === 'fr' ? 'Continuer mes achats' : 'Continue shopping'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {!orderPlaced && (
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'fr' ? 'Retour au panier' : 'Back to cart'}
            </button>
          )}
          <h1 className="text-3xl font-bold">
            {language === 'fr' ? 'Finaliser la commande' : 'Checkout'}
          </h1>
        </div>

        {/* Progress Steps */}
        {!orderPlaced && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {checkoutSteps.map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step === s ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step === s ? 'border-primary bg-primary text-white' : 'border-muted'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {s === 'shipping'
                        ? language === 'fr' ? 'Livraison' : 'Shipping'
                        : s === 'payment'
                        ? language === 'fr' ? 'Paiement' : 'Payment'
                        : language === 'fr' ? 'Confirmation' : 'Confirmation'}
                    </span>
                  </div>
                  {idx < checkoutSteps.length - 1 && (
                    <div
                      className={`w-10 sm:w-16 h-1 mx-2 ${
                        idx < checkoutSteps.indexOf(step as any) ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* STEP: Shipping */}
            {step === 'shipping' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Truck className="w-6 h-6" />
                  {language === 'fr' ? 'Informations de livraison' : 'Shipping Information'}
                </h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'fr' ? 'Nom complet' : 'Full name'} *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'fr' ? 'Téléphone' : 'Phone'} *
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="jean@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Adresse' : 'Address'} *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Quartier Bastos, Rue 1234"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'fr' ? 'Ville' : 'City'}
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'fr' ? 'Pays' : 'Country'}
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'fr' ? 'Code postal' : 'Postal code'}
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="BP 123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Notes (optionnel)' : 'Notes (optional)'}
                    </label>
                    <textarea
                      value={shippingInfo.notes}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-24"
                      placeholder={language === 'fr' ? 'Instructions spéciales pour la livraison...' : 'Special delivery instructions...'}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
                      toast.error(language === 'fr' ? 'Veuillez remplir les champs obligatoires' : 'Please fill required fields');
                      return;
                    }
                    setStep('payment');
                  }}
                  className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  {language === 'fr' ? 'Continuer vers le paiement' : 'Continue to payment'}
                </button>
              </div>
            )}

            {/* STEP: Payment */}
            {step === 'payment' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  {language === 'fr' ? 'Méthode de paiement' : 'Payment Method'}
                </h2>

                <div className="space-y-3">
                  {/* Wallet */}
                  <div
                    onClick={() => hasSufficientBalance && setPaymentMethod('wallet')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    } ${!hasSufficientBalance ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          disabled={!hasSufficientBalance}
                          className="w-4 h-4"
                        />
                        <Wallet className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {language === 'fr' ? 'Mon Portefeuille' : 'My Wallet'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Solde:' : 'Balance:'}{' '}
                            <span className={hasSufficientBalance ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                              {wallet ? formatPrice(wallet.balance) : formatPrice(0)}
                            </span>
                          </p>
                        </div>
                      </div>
                      {!hasSufficientBalance && (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/wallet'); }}
                          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                          {language === 'fr' ? 'Recharger' : 'Top up'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Money */}
                  <div
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'mobile' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input type="radio" checked={paymentMethod === 'mobile'} onChange={() => setPaymentMethod('mobile')} className="w-4 h-4" />
                      <Smartphone className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-sm text-muted-foreground">MTN, Orange Money</p>
                      </div>
                    </div>
                    {paymentMethod === 'mobile' && (
                      <div className="ml-7 space-y-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMobileMoneyProvider('mtn'); }}
                            className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              mobileMoneyProvider === 'mtn' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-border'
                            }`}
                          >
                            MTN MoMo
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMobileMoneyProvider('orange'); }}
                            className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              mobileMoneyProvider === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-border'
                            }`}
                          >
                            Orange Money
                          </button>
                        </div>
                        <input
                          type="tel"
                          value={mobileMoneyNumber}
                          onChange={(e) => setMobileMoneyNumber(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="+237 6XX XXX XXX"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4" />
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{language === 'fr' ? 'Carte bancaire' : 'Credit Card'}</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </div>
                  </div>

                  {/* Cash is only available for physical orders */}
                  {hasPhysicalItems && (
                    <div
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-4 h-4" />
                        <div className="w-5 h-5 text-green-600 flex items-center justify-center font-bold text-xs">CFA</div>
                        <div>
                          <p className="font-medium">
                            {language === 'fr' ? 'Paiement à la livraison' : 'Cash on Delivery'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Espèces à la réception' : 'Cash upon receipt'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => hasPhysicalItems ? setStep('shipping') : navigate('/cart')}
                    className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    {language === 'fr' ? 'Retour' : 'Back'}
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    {language === 'fr' ? 'Passer la commande' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP: Confirmation */}
            {step === 'confirmation' && orderPlaced && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">
                  {language === 'fr' ? 'Commande confirmée !' : 'Order Confirmed!'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'fr'
                    ? 'Merci pour votre commande. Vous recevrez bientôt une confirmation par SMS ou email.'
                    : 'Thank you for your order. You will soon receive a confirmation by SMS or email.'}
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-6 inline-block">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'fr' ? 'Numéro de commande' : 'Order Number'}
                  </p>
                  <p className="text-2xl font-bold text-primary">#{orderNumber}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-medium mb-2">{language === 'fr' ? 'Récapitulatif' : 'Summary'}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === 'fr' ? 'Total payé' : 'Total paid'}</span>
                    <span className="font-bold text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">{language === 'fr' ? 'Méthode' : 'Method'}</span>
                    <span className="font-medium">
                      {paymentMethod === 'wallet' ? (language === 'fr' ? 'Portefeuille' : 'Wallet')
                        : paymentMethod === 'mobile' ? 'Mobile Money'
                        : paymentMethod === 'card' ? (language === 'fr' ? 'Carte bancaire' : 'Credit Card')
                        : (language === 'fr' ? 'Paiement à la livraison' : 'Cash on Delivery')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/orders')}
                    className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    {language === 'fr' ? 'Voir mes commandes' : 'View my orders'}
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    {language === 'fr' ? "Retour à l'accueil" : 'Back to home'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">
                {language === 'fr' ? 'Résumé de la commande' : 'Order Summary'}
              </h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {enrichedItems.map((item) => {
                  const itemPrice = getItemPrice(item);
                  return (
                    <div key={`${item.productId}-${item.type}`} className="flex gap-3">
                      <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.product.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            item.type === 'sale' ? 'bg-green-100 text-green-700' :
                            item.type === 'digital' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.type === 'sale' ? <Package className="w-3 h-3 inline mr-0.5" /> :
                             item.type === 'digital' ? <FileText className="w-3 h-3 inline mr-0.5" /> :
                             <Tag className="w-3 h-3 inline mr-0.5" />}
                            {item.type === 'sale' ? (language === 'fr' ? 'Achat' : 'Buy') :
                             item.type === 'digital' ? 'PDF' :
                             `${item.rentalDays || 7}j`}
                          </span>
                          {item.type !== 'digital' && <p className="text-xs text-muted-foreground">× {item.quantity}</p>}
                        </div>
                      </div>
                      <p className="font-bold text-sm flex-shrink-0">{formatPrice(itemPrice * (item.type === 'digital' ? 1 : item.quantity))}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === 'fr' ? 'Livraison' : 'Shipping'}</span>
                  <span className="font-medium">
                    {shipping === 0 ? (language === 'fr' ? 'Gratuit' : 'Free') : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary text-xl">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
