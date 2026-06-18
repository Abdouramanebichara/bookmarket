import { useEffect, useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, useMapEvents, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, passwordsMatch } from '../../utils/validation';
import { PasswordStrengthIndicator } from '../../components/PasswordStrengthIndicator';
import { Eye, EyeOff, Store, Mail, MapPin, Lock, Phone, UserPlus, X, FileText, Upload, Navigation, Building2, LocateFixed, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import type { LibraryDocumentType, UploadedDocument } from '../../types';

type DocumentKey = LibraryDocumentType;

type RequiredDocumentConfig = {
  key: DocumentKey;
  label: string;
  required: boolean;
};

const LIBRARY_DOCUMENTS: RequiredDocumentConfig[] = [
  { key: 'rccm', label: 'RCCM', required: true },
  { key: 'taxpayer_card', label: 'Carte de contribuable / NIU', required: true },
  { key: 'creation_certificate', label: 'Attestation de création', required: true },
  { key: 'manager_id', label: 'CNI du responsable', required: true },
  { key: 'location_plan', label: 'Plan de localisation', required: true },
  { key: 'address_proof', label: 'Contrat de bail ou preuve d’adresse', required: true },
  { key: 'tax_certificate', label: 'Patente ou justificatif fiscal', required: false },
];

function fileToUploadedDocument(file: File, config: RequiredDocumentConfig): Promise<UploadedDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `${config.key}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: config.key,
        label: config.label,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl: String(reader.result),
        required: config.required,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => reject(new Error(`Impossible de lire le fichier ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

const DEFAULT_MAP_CENTER: [number, number] = [3.8480, 11.5021];

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);

  return null;
}

function LocationClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (event) => {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function LibraryLocationPicker({
  center,
  onSelect,
}: {
  center: [number, number];
  onSelect: (lat: number, lng: number) => void;
}) {
  return (
    <div className="h-72 sm:h-80 rounded-xl overflow-hidden border border-border bg-muted">
      <MapContainer center={center} zoom={15} scrollWheelZoom className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterUpdater center={center} />
        <LocationClickHandler onSelect={onSelect} />
        <CircleMarker
          center={center}
          radius={10}
          pathOptions={{ color: '#0D1B3E', fillColor: '#0D1B3E', fillOpacity: 0.9 }}
        />
      </MapContainer>
    </div>
  );
}

export function SignupLibrairiePage() {
  const navigate = useNavigate();
  const { registerLibraryRequest } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    libraryName: '',
    phone: '',
    location: '',
    city: 'Yaoundé',
    country: 'Cameroun',
    latitude: '',
    longitude: '',
    rccmNumber: '',
    taxpayerNumber: '',
    legalStatus: '',
  });

  const [documentFiles, setDocumentFiles] = useState<Partial<Record<DocumentKey, File>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  const selectedMapCenter = useMemo<[number, number]>(() => {
    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : DEFAULT_MAP_CENTER;
  }, [formData.latitude, formData.longitude]);

  const setGpsCoordinates = (latitude: number, longitude: number, accuracy?: number | null) => {
    setFormData((current) => ({
      ...current,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }));
    setLocationAccuracy(typeof accuracy === 'number' ? accuracy : null);
  };

  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n’est pas disponible sur cet appareil ou ce navigateur.');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoordinates(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
        toast.success('Localisation exacte récupérée depuis l’appareil.');
        setLocationLoading(false);
      },
      () => {
        toast.error('Impossible de récupérer la localisation. Autorisez la position dans le navigateur ou sélectionnez le point sur la carte.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleMapLocationSelect = (latitude: number, longitude: number) => {
    setGpsCoordinates(latitude, longitude, null);
    toast.success('Coordonnées GPS récupérées depuis la carte.');
  };

  const handleFileChange = (key: DocumentKey, file?: File) => {
    setDocumentFiles((current) => ({ ...current, [key]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.libraryName.trim() || !formData.phone.trim() || !formData.location.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.city.trim() || !formData.country.trim()) {
      toast.error('Veuillez renseigner la ville et le pays');
      return;
    }

    if (!formData.rccmNumber.trim() || !formData.taxpayerNumber.trim() || !formData.legalStatus.trim()) {
      toast.error('Veuillez renseigner les informations légales de la librairie');
      return;
    }

    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast.error('Veuillez renseigner des coordonnées GPS valides');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Adresse email invalide');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    const missingDocuments = LIBRARY_DOCUMENTS.filter((document) => document.required && !documentFiles[document.key]);
    if (missingDocuments.length > 0) {
      toast.error(`Documents obligatoires manquants : ${missingDocuments.map((doc) => doc.label).join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const uploadedDocuments = await Promise.all(
        LIBRARY_DOCUMENTS
          .filter((document) => documentFiles[document.key])
          .map((document) => fileToUploadedDocument(documentFiles[document.key] as File, document))
      );

      registerLibraryRequest({
        ownerName: formData.name,
        libraryName: formData.libraryName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        city: formData.city,
        country: formData.country,
        latitude,
        longitude,
        rccmNumber: formData.rccmNumber,
        taxpayerNumber: formData.taxpayerNumber,
        legalStatus: formData.legalStatus,
        documents: uploadedDocuments,
      });

      toast.success('Demande envoyée ! L’administrateur peut maintenant consulter votre dossier et valider votre inscription.');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l’inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden xl:flex xl:w-1/2 bg-accent p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">BookStore Business</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Rejoignez notre réseau<br />de librairies
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Votre inscription est transmise à l’administrateur avec les pièces justificatives de votre établissement.
          </p>

          <div className="space-y-4 opacity-90">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">✓</div><span>Validation administrative avant activation</span></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">✓</div><span>Gestion professionnelle des produits et stocks</span></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">✓</div><span>Localisation GPS visible pour les clients</span></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Retour à l'accueil"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-4xl py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Inscription Librairie</h2>
            <p className="text-muted-foreground">Remplissez le dossier complet pour validation par l’administrateur</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-lg">Informations de la librairie</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du responsable *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jean Dupont" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nom de la librairie *</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" value={formData.libraryName} onChange={(e) => setFormData({ ...formData, libraryName: e.target.value })} placeholder="Librairie du Centre" className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email professionnel *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contact@librairie.cm" className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+237 6XX XX XX XX" className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Adresse complète de la librairie *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Avenue Kennedy, Yaoundé" className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ville *</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pays *</label>
                  <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Latitude GPS *</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder="3.86097" className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Longitude GPS *</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder="11.52237" className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
                    <div>
                      <p className="font-semibold">Position GPS de la librairie</p>
                      <p className="text-sm text-muted-foreground">
                        Utilisez la position exacte de l’appareil ou cliquez sur la carte pour remplir automatiquement latitude et longitude.
                      </p>
                      {locationAccuracy !== null && (
                        <p className="text-xs text-emerald-600 mt-1">Précision estimée : ±{Math.round(locationAccuracy)} m</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleUseDeviceLocation}
                      disabled={locationLoading}
                      className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <LocateFixed className="w-4 h-4" />
                      {locationLoading ? 'Récupération...' : 'Utiliser ma position'}
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                      <MousePointerClick className="w-4 h-4" />
                      Cliquer sur la carte pour récupérer les coordonnées GPS
                    </div>
                    <LibraryLocationPicker center={selectedMapCenter} onSelect={handleMapLocationSelect} />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Les coordonnées affichées dans les champs seront transmises à l’administrateur avec le dossier d’inscription.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-lg">Informations légales</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro RCCM *</label>
                  <input type="text" value={formData.rccmNumber} onChange={(e) => setFormData({ ...formData, rccmNumber: e.target.value })} placeholder="RC/YAO/2026/..." className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">NIU / Carte contribuable *</label>
                  <input type="text" value={formData.taxpayerNumber} onChange={(e) => setFormData({ ...formData, taxpayerNumber: e.target.value })} placeholder="M012345678901A" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Statut juridique *</label>
                  <input type="text" value={formData.legalStatus} onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value })} placeholder="ETS, SARL, SA..." className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-lg">Documents à transmettre à l’administrateur</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Les documents marqués d’un astérisque sont obligatoires. L’administrateur pourra les consulter et les télécharger avant validation.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LIBRARY_DOCUMENTS.map((document) => {
                  const file = documentFiles[document.key];
                  return (
                    <label key={document.key} className="block border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-medium">{document.label} {document.required && <span className="text-red-500">*</span>}</p>
                          <p className="text-xs text-muted-foreground">PDF, image ou document scanné</p>
                        </div>
                        <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={(e) => handleFileChange(document.key, e.target.files?.[0])}
                        className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-accent file:text-white hover:file:bg-accent/90"
                      />
                      {file && <p className="mt-2 text-xs text-emerald-600 break-all">{file.name} — {formatFileSize(file.size)}</p>}
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <h3 className="font-bold text-lg mb-5">Sécurité du compte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Mot de passe *</label>
                  <div className="relative mb-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                  <PasswordStrengthIndicator password={formData.password} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirmer le mot de passe *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>
              </div>
            </section>

            <button type="submit" disabled={loading} className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Envoi du dossier...</> : <><UserPlus className="w-5 h-5" /> Envoyer la demande de création</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
            <button onClick={() => navigate('/auth/login')} className="text-primary hover:underline font-medium">Se connecter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
