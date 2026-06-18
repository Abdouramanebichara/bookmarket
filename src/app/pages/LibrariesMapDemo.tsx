import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { MOCK_LIBRAIRIES, YAOUNDE_CENTER } from '../data/mockData';
import { MapPin, Phone, Star, Navigation, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { Map } from '../components/Map';
import { Librairie } from '../types';

function getLatLng(library: Librairie): [number, number] {
  return [library.latitude ?? library.location.latitude, library.longitude ?? library.location.longitude];
}

function getMapsUrl(library: Librairie) {
  const [lat, lng] = getLatLng(library);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function calculateDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((lat - YAOUNDE_CENTER.lat) * Math.PI) / 180;
  const dLng = ((lng - YAOUNDE_CENTER.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((YAOUNDE_CENTER.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LibrariesMapDemo() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const cities = useMemo(
    () => ['all', ...Array.from(new Set(MOCK_LIBRAIRIES.map((library) => library.location.city)))],
    []
  );

  const librariesWithDistance = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MOCK_LIBRAIRIES
      .map((library) => {
        const [lat, lng] = getLatLng(library);
        return {
          ...library,
          distance: calculateDistance(lat, lng),
        };
      })
      .filter((library) => {
        const matchesCity = cityFilter === 'all' || library.location.city === cityFilter;
        const matchesSearch =
          !query ||
          library.name.toLowerCase().includes(query) ||
          (library.address || library.location.address).toLowerCase().includes(query) ||
          library.location.city.toLowerCase().includes(query);
        return matchesCity && matchesSearch;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [cityFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Librairies au Cameroun</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            {MOCK_LIBRAIRIES.length} librairies réelles référencées avec aperçu carte et liens Google Maps
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-sm">
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher par nom, quartier ou ville..."
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'all' ? 'Toutes les villes' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Map
              libraries={librariesWithDistance}
              center={[YAOUNDE_CENTER.lat, YAOUNDE_CENTER.lng]}
              zoom={7}
              onLibraryClick={(library) => navigate(`/libraries/${library.id}`)}
              className="h-[650px] rounded-2xl overflow-hidden shadow-lg"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Aperçu basé sur les coordonnées GPS disponibles publiquement. Les marqueurs ouvrent la fiche librairie, et le bouton Maps ouvre Google Maps.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Liste des librairies</h2>
              <span className="text-sm text-muted-foreground">{librariesWithDistance.length} résultat(s)</span>
            </div>

            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2">
              {librariesWithDistance.map((library) => (
                <div
                  key={library.id}
                  className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all hover:ring-2 hover:ring-primary"
                >
                  <button
                    onClick={() => navigate(`/libraries/${library.id}`)}
                    className="w-full text-left"
                    type="button"
                  >
                    <div className="flex gap-3">
                      <img
                        src={library.logo}
                        alt={library.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <h3 className="font-semibold mb-1 line-clamp-2 flex-1">{library.name}</h3>
                          {library.verified && <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{library.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({library.reviewsCount} avis)</span>
                        </div>

                        <div className="flex items-start gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{library.address || library.location.address}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{library.phone || 'Non renseigné'}</span>
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/libraries/${library.id}`)}
                      className="rounded-lg bg-[#0D1B3E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0D1B3E]/90"
                    >
                      Voir boutique
                    </button>
                    <a
                      href={getMapsUrl(library)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1 hover:bg-muted"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Google Maps
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
