import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface ProductModalProps {
  product: any;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [showPayment, setShowPayment] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    setShowPayment(true);
  };

  if (showPayment) {
    return (
      <PaymentModal
        product={product}
        onClose={() => {
          setShowPayment(false);
          onClose();
        }}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop avec blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-10 p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Image du produit */}
          <div className="mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>

          {/* Informations du produit */}
          <div className="space-y-4">
            <div>
              <h2 className="font-[var(--font-display)] font-bold text-3xl text-[#0D1B3E] mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="text-[#F97316]">📍</span>
                {product.store}
              </p>
            </div>

            {/* Note */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
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
              <span className="font-semibold text-gray-900">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} avis)</span>
            </div>

            {/* Prix */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-4xl text-[#0D1B3E]">
                  {product.price.toLocaleString()} FCFA
                </span>
                {product.type === 'location' && (
                  <span className="text-lg text-gray-500">/mois</span>
                )}
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {product.oldPrice.toLocaleString()} FCFA
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {product.type === 'location' ? 'Prix de location mensuel' : 'Prix de vente'}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description ||
                  'Ce produit de qualité supérieure est idéal pour vos besoins scolaires et professionnels. Disponible immédiatement avec livraison rapide.'}
              </p>
            </div>

            {/* Badge */}
            {product.badge && (
              <div className="inline-flex px-4 py-2 bg-primary text-white rounded-lg font-semibold">
                ⭐ {product.badge}
              </div>
            )}

            {/* Bouton d'action */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                product.type === 'location'
                  ? 'bg-[#0D1B3E] hover:bg-[#0D1B3E]/90 text-white'
                  : 'bg-[#F97316] hover:bg-[#ea6a0f] text-white'
              }`}
            >
              {product.type === 'location' ? '📦 Réserver' : '🛒 Ajouter au panier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
