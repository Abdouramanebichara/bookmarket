import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'vente',
    category: '',
    stock: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Produit ajouté avec succès !');
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="font-[var(--font-display)] font-bold text-2xl text-[#0D1B3E] mb-6">
          Ajouter un produit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du produit
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0D1B3E] transition-all cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">Cliquez pour uploader une image</p>
              <p className="text-sm text-gray-400">PNG, JPG jusqu'à 5MB</p>
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
              placeholder="Ex: Cahier Oxford A4"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent resize-none"
              placeholder="Décrivez votre produit..."
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent bg-white"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="Livres">Livres & Romans</option>
              <option value="Papeterie">Papeterie</option>
              <option value="Fournitures scolaires">Fournitures scolaires</option>
              <option value="Supports didactiques">Supports didactiques</option>
              <option value="Calculatrices">Calculatrices</option>
              <option value="Cahiers">Cahiers & Classeurs</option>
              <option value="Stylos">Stylos</option>
              <option value="Sacs">Sacs</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'vente' })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.type === 'vente'
                    ? 'border-[#F97316] bg-[#F97316]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="font-semibold">À vendre</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'location' })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.type === 'location'
                    ? 'border-[#0D1B3E] bg-[#0D1B3E]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">📦</div>
                <div className="font-semibold">À louer</div>
              </button>
            </div>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix {formData.type === 'location' && '(par mois)'}
            </label>
            <div className="relative">
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                FCFA
              </span>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock disponible
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0f] transition-all"
            >
              Ajouter le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
