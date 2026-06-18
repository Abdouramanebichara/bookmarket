import { useState } from 'react';
import { X, CreditCard, Smartphone, Building } from 'lucide-react';

interface PaymentModalProps {
  product: any;
  onClose: () => void;
  onBack: () => void;
}

export function PaymentModal({ product, onClose, onBack }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Carte bancaire', icon: CreditCard, color: 'blue' },
    { id: 'mobile', name: 'Mobile Money', icon: Smartphone, color: 'green' },
    { id: 'bank', name: 'Virement bancaire', icon: Building, color: 'purple' },
  ];

  const handleValidate = async () => {
    if (!selectedMethod) return;

    setLoading(true);
    // Simulation d'un paiement
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Commande validée ! Votre produit est maintenant en attente de livraison.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop avec blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="font-[var(--font-display)] font-bold text-2xl text-[#0D1B3E] mb-6">
          Finaliser {product.type === 'location' ? 'la réservation' : "l'achat"}
        </h2>

        {/* Résumé du produit */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.store}</p>
              <p className="font-bold text-[#0D1B3E]">
                {product.price.toLocaleString()} FCFA
                {product.type === 'location' && (
                  <span className="text-xs text-gray-500 font-normal ml-1">/mois</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Méthodes de paiement */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Moyen de paiement</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 border-2 rounded-xl transition-all flex items-center gap-4 ${
                    selectedMethod === method.id
                      ? 'border-[#0D1B3E] bg-[#0D1B3E]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      method.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : method.color === 'green'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-gray-900">{method.name}</span>
                  {selectedMethod === method.id && (
                    <div className="ml-auto w-5 h-5 bg-[#0D1B3E] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Retour
          </button>
          <button
            onClick={handleValidate}
            disabled={!selectedMethod || loading}
            className="flex-1 px-6 py-3 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Traitement...' : 'Valider'}
          </button>
        </div>
      </div>
    </div>
  );
}
