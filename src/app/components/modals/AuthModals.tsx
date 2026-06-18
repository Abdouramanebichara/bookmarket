import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useAuth, UserType } from '../../context/AuthContext';

interface AuthModalsProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export function AuthModals({ isOpen, mode, onClose, onSwitchMode }: AuthModalsProps) {
  const { login, signup } = useAuth();
  const [step, setStep] = useState<'choice' | 'form'>('choice');
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    avatar: '',
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  if (!isOpen) return null;

  const handleUserTypeChoice = (type: UserType) => {
    setUserType(type);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password, userType);
      } else {
        await signup({
          ...formData,
          type: userType,
        });
      }
      onClose();
      resetForm();
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('choice');
    setUserType(null);
    setFormData({ name: '', email: '', password: '', location: '', avatar: '' });
    setPreviewImage('');
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop avec blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="font-[var(--font-display)] font-bold text-2xl text-[#0D1B3E] mb-6">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h2>

        {step === 'choice' ? (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">Choisissez votre type de compte :</p>

            <button
              onClick={() => handleUserTypeChoice('client')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#F97316] hover:bg-[#F97316]/5 transition-all group"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#F97316]">
                Client
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Acheter et louer des livres et fournitures
              </p>
            </button>

            <button
              onClick={() => handleUserTypeChoice('librairie')}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#0D1B3E] hover:bg-[#0D1B3E]/5 transition-all group"
            >
              <div className="text-4xl mb-3">🏪</div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0D1B3E]">
                Librairie
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Vendre et louer vos produits en ligne
              </p>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <>
                {/* Photo de profil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      Choisir une photo
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom {userType === 'librairie' && 'de la librairie'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
                    placeholder={userType === 'librairie' ? 'Librairie Excellence' : 'Votre nom'}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse de localisation
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] focus:border-transparent"
                  placeholder="Yaoundé, Cameroun"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep('choice')}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#0D1B3E] text-white font-semibold rounded-xl hover:bg-[#0D1B3E]/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  onSwitchMode(mode === 'login' ? 'signup' : 'login');
                  setStep('choice');
                }}
                className="text-sm text-[#F97316] hover:underline"
              >
                {mode === 'login'
                  ? "Pas encore de compte ? S'inscrire"
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
