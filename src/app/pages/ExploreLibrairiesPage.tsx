import { MapPin, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { MOCK_LIBRAIRIES } from '../data/mockData';

export function ExploreLibrairiesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 sm:pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h1 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1B3E] mb-2 sm:mb-3">
            Explorer les librairies
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez les librairies partenaires référencées au Cameroun avec leurs adresses et coordonnées GPS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LIBRAIRIES.map((lib) => (
            <div
              key={lib.id}
              onClick={() => navigate(`/libraries/${lib.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={lib.banner || lib.coverImage}
                  alt={lib.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50" />

                <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-xl shadow-lg overflow-hidden border-4 border-white">
                  <img src={lib.logo} alt={lib.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="p-6 pt-12">
                <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{lib.name}</h3>

                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#F97316] mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600 line-clamp-2">{lib.address || lib.location.address}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{lib.rating}</span>
                  <span className="text-gray-500 text-sm">({lib.reviewsCount} avis)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className="py-3 bg-[#0D1B3E] text-white font-semibold rounded-xl hover:bg-[#0D1B3E]/90 transition-all group-hover:bg-[#F97316]">
                    Voir boutique
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lib.latitude || lib.location.latitude},${lib.longitude || lib.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
