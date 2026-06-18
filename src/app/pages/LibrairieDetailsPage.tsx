import { useParams, useNavigate } from 'react-router';
import { MapPin, Star, Phone, Mail, Navigation, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import { PopularProducts } from '../components/PopularProducts';
import { MOCK_LIBRAIRIES } from '../data/mockData';
import { Map } from '../components/Map';

export function LibrairieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const librairie = MOCK_LIBRAIRIES.find((library) => library.id === id);

  if (!librairie) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Librairie non trouvée</h2>
          <button onClick={() => navigate('/libraries')} className="text-primary hover:underline">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const latitude = librairie.latitude ?? librairie.location.latitude;
  const longitude = librairie.longitude ?? librairie.location.longitude;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <img
          src={librairie.banner || librairie.coverImage}
          alt={librairie.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-white border-4 border-white">
              <img src={librairie.logo} alt={librairie.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="font-[var(--font-display)] font-bold text-3xl md:text-4xl text-[#0D1B3E]">
                  {librairie.name}
                </h1>
                {librairie.verified && <ShieldCheck className="w-7 h-7 text-blue-600 shrink-0 mt-1" />}
              </div>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-[#F97316] mt-0.5" />
                  <span className="text-gray-700">{librairie.address || librairie.location.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{librairie.rating}</span>
                  <span className="text-gray-600">({librairie.reviewsCount} avis)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{librairie.description}</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {librairie.phone && (
                  <a
                    href={`tel:${librairie.phone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#ea6a0f] transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Appeler
                  </a>
                )}
                {librairie.email && (
                  <a
                    href={`mailto:${librairie.email}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#0D1B3E] text-[#0D1B3E] font-semibold rounded-xl hover:bg-[#0D1B3E] hover:text-white transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </a>
                )}
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Navigation className="w-5 h-5" />
                  Itinéraire
                </a>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  Voir sur Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-2xl text-[#0D1B3E]">Aperçu carte</h2>
                <p className="text-sm text-gray-500">Coordonnées GPS : {latitude.toFixed(5)}, {longitude.toFixed(5)}</p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Google Maps <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <Map libraries={[librairie]} center={[latitude, longitude]} zoom={15} className="h-[360px] rounded-xl overflow-hidden" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-xl text-[#0D1B3E]">Informations web</h2>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Ville</p>
              <p className="font-semibold">{librairie.location.city}, {librairie.location.country}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Horaires</p>
              <p className="font-semibold">{librairie.openingHours || 'Non renseigné'}</p>
            </div>
            {librairie.website && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Site web</p>
                <a href={librairie.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline flex items-center gap-1 break-all">
                  <Globe className="w-4 h-4" />
                  {librairie.website}
                </a>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Source mock</p>
              <p className="font-semibold">{librairie.source || 'Source non précisée'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="font-[var(--font-display)] font-bold text-2xl md:text-3xl text-[#0D1B3E] mb-6">
            Nos Produits
          </h2>
          <PopularProducts />
        </div>
      </div>
    </div>
  );
}
