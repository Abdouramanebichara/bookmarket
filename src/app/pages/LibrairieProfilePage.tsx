import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_LIBRAIRIES } from '../data/mockData';
import {
  Store, MapPin, Phone, Mail, Clock, Star, Package,
  Edit, Save, X, Camera, Shield, Calendar, Users
} from 'lucide-react';
import { toast } from 'sonner';

export function LibrairieProfilePage() {
  const { user } = useAuth();

  // Find library data for current user
  const libraryData = MOCK_LIBRAIRIES[0]; // For demo, using first library

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: libraryData.name,
    email: libraryData.email,
    phone: libraryData.phone,
    address: libraryData.address,
    openingHours: libraryData.openingHours,
    description: libraryData.description,
  });

  const handleSave = () => {
    toast.success('Profil mis à jour avec succès');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: libraryData.name,
      email: libraryData.email,
      phone: libraryData.phone,
      address: libraryData.address,
      openingHours: libraryData.openingHours,
      description: libraryData.description,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil de la Librairie</h1>
          <p className="text-muted-foreground">
            Gérez les informations de votre établissement
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner & Logo */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="relative h-48 bg-primary">
                <img
                  src={libraryData.banner}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="relative -mt-16">
                    <div className="w-24 h-24 rounded-xl bg-white border-4 border-white overflow-hidden">
                      <img
                        src={libraryData.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-lg">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {libraryData.verified && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Shield className="w-4 h-4" />
                              Vérifiée
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Membre depuis {new Date(libraryData.createdAt).getFullYear()}
                          </span>
                        </div>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Form */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-bold mb-6">Informations</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Store className="w-4 h-4 inline mr-2" />
                    Nom de la librairie
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
                      Téléphone
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
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-bold mb-4">Statistiques</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">Note moyenne</span>
                  </div>
                  <span className="font-bold text-lg">{libraryData.rating}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Avis</span>
                  </div>
                  <span className="font-bold text-lg">{libraryData.reviewsCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Produits</span>
                  </div>
                  <span className="font-bold text-lg">{libraryData.productsCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-accent rounded-xl p-6 text-primary-foreground">
              <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm opacity-90 mb-4">
                Contactez notre équipe de support pour toute question
              </p>
              <button className="w-full bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
