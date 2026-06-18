import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, Lock, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export function ClientProfilePage() {
  const { user } = useAuth();
  const { language } = useLocalization();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'client@bookstore.com',
    phone: user?.phone || '+237 690 000 000',
    address: user?.address || '123 Avenue des Cocotiers, Bastos',
    city: user?.city || 'Yaoundé',
    country: user?.country || 'Cameroun',
  });

  const handleSave = () => {
    toast.success(language === 'fr' ? 'Profil mis à jour avec succès' : 'Profile updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'John Doe',
      email: user?.email || 'client@bookstore.com',
      phone: user?.phone || '+237 690 000 000',
      address: user?.address || '123 Avenue des Cocotiers, Bastos',
      city: user?.city || 'Yaoundé',
      country: user?.country || 'Cameroun',
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'fr' ? 'Veuillez sélectionner une image' : 'Please select an image');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarUrl(ev.target?.result as string);
      toast.success(language === 'fr' ? 'Photo de profil mise à jour' : 'Profile photo updated');
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    setPasswordError('');
    if (!passwordForm.current) {
      setPasswordError(language === 'fr' ? 'Veuillez entrer votre mot de passe actuel.' : 'Please enter your current password.');
      return;
    }
    if (passwordForm.newPwd.length < 6) {
      setPasswordError(language === 'fr' ? 'Le nouveau mot de passe doit contenir au moins 6 caractères.' : 'New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPwd !== passwordForm.confirm) {
      setPasswordError(language === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    toast.success(language === 'fr' ? 'Mot de passe modifié avec succès !' : 'Password changed successfully!');
    setPasswordForm({ current: '', newPwd: '', confirm: '' });
    setShowPasswordSection(false);
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:groupereseau.enspy@gmail.com?subject=Support%20client&body=Bonjour%2C%20j%27ai%20besoin%20d%27aide%20avec%20mon%20compte.';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {language === 'fr' ? 'Mon Profil' : 'My Profile'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'fr' ? 'Gérez vos informations personnelles' : 'Manage your personal information'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="relative h-32 bg-primary"></div>

              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="relative -mt-16">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User className="w-12 h-12 text-primary" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                      title={language === 'fr' ? 'Changer la photo' : 'Change photo'}
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {language === 'fr' ? 'Membre depuis 2024' : 'Member since 2024'}
                          </span>
                        </div>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {language === 'fr' ? 'Modifier' : 'Edit'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Form */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-bold mb-6">
                {language === 'fr' ? 'Informations' : 'Information'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    {language === 'fr' ? 'Nom complet' : 'Full name'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {language === 'fr' ? 'Téléphone' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {language === 'fr' ? 'Adresse' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Ville' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Pays' : 'Country'}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {language === 'fr' ? 'Enregistrer' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">
                      {language === 'fr' ? 'Mot de passe' : 'Password'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Dernière modification inconnue' : 'Last change unknown'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowPasswordSection(!showPasswordSection); setPasswordError(''); setPasswordForm({ current: '', newPwd: '', confirm: '' }); }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {showPasswordSection
                    ? (language === 'fr' ? 'Annuler' : 'Cancel')
                    : (language === 'fr' ? 'Modifier' : 'Change')}
                </button>
              </div>

              {showPasswordSection && (
                <div className="mt-5 space-y-4">
                  {/* Current password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Mot de passe actuel' : 'Current password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPwd ? 'text' : 'password'}
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 pr-10 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Nouveau mot de passe' : 'New password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        value={passwordForm.newPwd}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPwd: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 pr-10 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.newPwd.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordForm.newPwd.length >= i * 3
                              ? passwordForm.newPwd.length >= 10 ? 'bg-green-500' : 'bg-yellow-400'
                              : 'bg-muted'
                          }`} />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {passwordForm.newPwd.length < 6
                            ? (language === 'fr' ? 'Faible' : 'Weak')
                            : passwordForm.newPwd.length < 10
                            ? (language === 'fr' ? 'Moyen' : 'Fair')
                            : (language === 'fr' ? 'Fort' : 'Strong')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'fr' ? 'Confirmer le nouveau mot de passe' : 'Confirm new password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2 pr-10 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${
                          passwordForm.confirm && passwordForm.confirm !== passwordForm.newPwd
                            ? 'border-red-400'
                            : 'border-border'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.confirm && passwordForm.confirm !== passwordForm.newPwd && (
                      <p className="text-xs text-red-500 mt-1">
                        {language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match'}
                      </p>
                    )}
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                      {passwordError}
                    </p>
                  )}

                  <button
                    onClick={handleChangePassword}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Lock className="w-4 h-4" />
                    {language === 'fr' ? 'Mettre à jour le mot de passe' : 'Update password'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-accent rounded-xl p-6 text-primary-foreground">
              <h3 className="font-bold mb-2">
                {language === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
              </h3>
              <p className="text-sm opacity-90 mb-4">
                {language === 'fr'
                  ? 'Contactez notre équipe de support pour toute question'
                  : 'Contact our support team for any questions'}
              </p>
              <button
                onClick={handleContactSupport}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                {language === 'fr' ? 'Contacter le support' : 'Contact support'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
