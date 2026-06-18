import { useState, useEffect } from 'react';
import { X, Edit2, Camera, Globe, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocalization, languages, Language } from '../../context/LocalizationContext';
import { useTheme, themes, Theme } from '../../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLocalization();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    language: user?.language || 'fr',
    theme: user?.theme || 'light',
  });
  const [previewImage, setPreviewImage] = useState<string>(user?.avatar || '');

  // Empêcher le scroll de l'arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleEdit = () => {
    setFormData({
      name: user.name,
      email: user.email,
      location: user.location || '',
      avatar: user.avatar || '',
      language: user.language || 'fr',
      theme: user.theme || 'light',
    });
    setPreviewImage(user.avatar || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      location: user.location || '',
      avatar: user.avatar || '',
      language: user.language || 'fr',
      theme: user.theme || 'light',
    });
    setPreviewImage(user.avatar || '');
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setLanguage(formData.language as Language);
    setTheme(formData.theme as Theme);
    setIsEditing(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop avec blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-6 pb-0">
          <h2 className="font-[var(--font-display)] font-bold text-2xl text-[#0D1B3E] dark:text-white mb-4">
            {t('myProfile')}
          </h2>

          <div className="mb-4 text-center">
            <div className="w-20 h-20 bg-[#0D1B3E] rounded-full mx-auto flex items-center justify-center text-3xl text-white mb-3 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user.type === 'client' ? '👤' : '🏪'}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {t('accountType')} {t(user.type as 'client' | 'librairie')}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 flex-1">
          {!isEditing ? (
            /* Mode Visualisation */
            <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {user.type === 'librairie' ? t('libraryName') : t('name')}
              </label>
              <p className="text-base font-medium text-gray-900 dark:text-white">{user.name}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('email')}
              </label>
              <p className="text-base font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('location')}
              </label>
              <p className="text-base font-medium text-gray-900 dark:text-white">{user.location || t('notProvided')}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('password')}
              </label>
              <p className="text-base font-medium text-gray-900 dark:text-white">••••••••</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('languageDisplay')}
              </label>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {languages[user.language as Language] || languages.fr}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                <Moon className="w-4 h-4" />
                {t('themeDisplay')}
              </label>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {themes[user.theme as Theme] || themes.light}
              </p>
            </div>

            <div className="flex gap-3 pt-3 pb-6">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                {t('close')}
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 px-6 py-2.5 bg-[#0D1B3E] dark:bg-blue-600 text-white font-semibold rounded-xl hover:bg-[#0D1B3E]/90 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {t('edit')}
              </button>
            </div>
          </div>
          ) : (
            /* Mode Édition */
            <form onSubmit={handleSubmit} className="space-y-3">
            {/* Modification de la photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('profilePhoto')}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-700">
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
                    id="avatar-edit-upload"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="avatar-edit-upload"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer text-center"
                  >
                    {t('choosePhoto')}
                  </label>
                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage('');
                        setFormData({ ...formData, avatar: '' });
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all text-sm"
                    >
                      {t('deletePhoto')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {user.type === 'librairie' ? t('libraryName') : t('name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('location')}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Sélecteur de langue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('languageDisplay')}
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('chooseLanguage')}
              </p>
            </div>

            {/* Sélecteur de thème */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Moon className="w-4 h-4" />
                {t('themeDisplay')}
              </label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D1B3E] dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {Object.entries(themes).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('chooseTheme')}
              </p>
            </div>

            <div className="flex gap-3 pt-3 pb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-2.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-[#0D1B3E] dark:bg-blue-600 text-white font-semibold rounded-xl hover:bg-[#0D1B3E]/90 dark:hover:bg-blue-700 transition-all"
              >
                {t('save')}
              </button>
            </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
