import { useState } from 'react';
import { MOCK_LIBRAIRIES } from '../data/mockData';
import { Settings, Store, Bell, Lock, Palette, Globe, Save, Upload, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function LibrairieSettingsPage() {
  const currentLibrary = MOCK_LIBRAIRIES[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile');

  // Profile settings
  const [profile, setProfile] = useState({
    name: currentLibrary.name,
    description: currentLibrary.description,
    email: currentLibrary.email,
    phone: currentLibrary.phone,
    address: currentLibrary.address,
    city: currentLibrary.city,
    website: currentLibrary.website || '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    lowStock: true,
    newReviews: true,
    rentalReminders: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'fr',
    currency: 'XAF',
  });

  const handleSaveProfile = () => {
    toast.success('Profil mis à jour avec succès');
  };

  const handleSaveNotifications = () => {
    toast.success('Préférences de notifications enregistrées');
  };

  const handleSaveSecurity = () => {
    toast.success('Paramètres de sécurité mis à jour');
  };

  const handleSaveAppearance = () => {
    toast.success('Préférences d\'affichage enregistrées');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Paramètres</h1>
              <p className="text-sm text-muted-foreground">
                Gérez vos préférences et paramètres de compte
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-2 animate-slide-in-right">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Store className="w-5 h-5" />
                Profil
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Bell className="w-5 h-5" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'security'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Lock className="w-5 h-5" />
                Sécurité
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'appearance'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Palette className="w-5 h-5" />
                Apparence
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Store className="w-6 h-6" />
                  Informations de la Librairie
                </h2>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Logo de la librairie</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-accent rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                        {currentLibrary.name.charAt(0)}
                      </div>
                      <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Télécharger un logo
                      </button>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom de la librairie</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Site web</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={4}
                    />
                  </div>

                  {/* Address */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Adresse</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Ville</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pays</label>
                      <input
                        type="text"
                        value="Cameroun"
                        disabled
                        className="w-full px-4 py-2 bg-muted border border-border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6" />
                  Préférences de Notifications
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Notifications de l'application</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'newOrders', label: 'Nouvelles commandes', description: 'Recevoir une notification pour chaque nouvelle commande' },
                        { key: 'lowStock', label: 'Stock faible', description: 'Alertes quand un produit a un stock inférieur à 5 unités' },
                        { key: 'newReviews', label: 'Nouveaux avis', description: 'Notification quand un client laisse un avis' },
                        { key: 'rentalReminders', label: 'Rappels de location', description: 'Alertes pour les locations qui arrivent à échéance' },
                      ].map((setting) => (
                        <label key={setting.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              [setting.key]: e.target.checked
                            })}
                            className="w-5 h-5 mt-0.5"
                          />
                          <div>
                            <p className="font-medium">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Canaux de notification</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked
                          })}
                          className="w-5 h-5 mt-0.5"
                        />
                        <div>
                          <p className="font-medium">Notifications par email</p>
                          <p className="text-sm text-muted-foreground">Recevoir les notifications importantes par email</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: e.target.checked
                          })}
                          className="w-5 h-5 mt-0.5"
                        />
                        <div>
                          <p className="font-medium">Notifications par SMS</p>
                          <p className="text-sm text-muted-foreground">Recevoir les alertes urgentes par SMS</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <button
                      onClick={handleSaveNotifications}
                      className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Enregistrer les préférences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Sécurité du Compte
                </h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h3 className="font-semibold mb-4">Changer le mot de passe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Options */}
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Options de sécurité</h3>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            twoFactorAuth: e.target.checked
                          })}
                          className="w-5 h-5 mt-0.5"
                        />
                        <div>
                          <p className="font-medium">Authentification à deux facteurs</p>
                          <p className="text-sm text-muted-foreground">Ajouter une couche de sécurité supplémentaire à votre compte</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => setSecuritySettings({
                            ...securitySettings,
                            loginAlerts: e.target.checked
                          })}
                          className="w-5 h-5 mt-0.5"
                        />
                        <div>
                          <p className="font-medium">Alertes de connexion</p>
                          <p className="text-sm text-muted-foreground">Recevoir un email lors de chaque nouvelle connexion</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <button
                      onClick={handleSaveSecurity}
                      className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Enregistrer les paramètres
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6" />
                  Apparence et Préférences
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Thème</label>
                    <select
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings({
                        ...appearanceSettings,
                        theme: e.target.value
                      })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Langue</label>
                    <select
                      value={appearanceSettings.language}
                      onChange={(e) => setAppearanceSettings({
                        ...appearanceSettings,
                        language: e.target.value
                      })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Devise</label>
                    <select
                      value={appearanceSettings.currency}
                      onChange={(e) => setAppearanceSettings({
                        ...appearanceSettings,
                        currency: e.target.value
                      })}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="XAF">FCFA (XAF)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <button
                      onClick={handleSaveAppearance}
                      className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Enregistrer les préférences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
