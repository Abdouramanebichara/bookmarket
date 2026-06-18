import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Map } from '../components/Map';
import { LibraryCard } from '../components/LibraryCard';
import { Librairie } from '../types';
import { useAPI } from '../hooks/useAPI';
import { MapPin, List, Search, Sliders } from 'lucide-react';
import { toast } from 'sonner';

export function LibraryMapPage() {
  const navigate = useNavigate();
  const { get } = useAPI();

  const [libraries, setLibraries] = useState<Librairie[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Librairie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number]>([3.8480, 11.5021]);
  const [radiusFilter, setRadiusFilter] = useState<number>(50);

  useEffect(() => {
    getUserLocation();
    loadLibraries();
  }, []);

  useEffect(() => {
    filterLibraries();
  }, [searchQuery, libraries, radiusFilter, userLocation]);


  const calculateDistance = (from: [number, number], to: [number, number]) => {
    const R = 6371;
    const dLat = ((to[0] - from[0]) * Math.PI) / 180;
    const dLng = ((to[1] - from[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from[0] * Math.PI) / 180) *
        Math.cos((to[0] * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const withDistance = (items: Librairie[]) =>
    items.map((library) => {
      const latitude = library.latitude ?? library.location.latitude;
      const longitude = library.longitude ?? library.location.longitude;
      return {
        ...library,
        distance: calculateDistance(userLocation, [latitude, longitude]),
      };
    });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const loadLibraries = async () => {
    setLoading(true);
    try {
      const data = await get('/librairies');
      const preparedLibraries = withDistance(data.librairies || []);
      setLibraries(preparedLibraries);
      setFilteredLibraries(preparedLibraries);
    } catch (error) {
      console.error('Failed to load libraries:', error);
      toast.error('Échec du chargement des librairies');
    } finally {
      setLoading(false);
    }
  };

  const filterLibraries = () => {
    let filtered = withDistance(libraries);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lib) =>
          lib.name.toLowerCase().includes(query) ||
          lib.description.toLowerCase().includes(query) ||
          lib.location.city.toLowerCase().includes(query)
      );
    }

    if (radiusFilter > 0 && userLocation) {
      filtered = filtered.filter((lib) => {
        if (lib.distance === undefined) return true;
        return lib.distance <= radiusFilter;
      });
    }

    setFilteredLibraries(filtered);
  };

  const handleLibraryClick = (library: Librairie) => {
    navigate(`/libraries/${library.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une librairie..."
                className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-input-background border border-border rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <select
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
                  className="bg-transparent focus:outline-none"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                  <option value={0}>Toutes</option>
                </select>
              </div>

              <div className="flex bg-input-background border border-border rounded-lg">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-l-lg flex items-center gap-2 ${
                    viewMode === 'map'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Carte
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-r-lg flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Liste
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            {filteredLibraries.length} librairie{filteredLibraries.length > 1 ? 's' : ''} trouvée
            {filteredLibraries.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Map
                libraries={filteredLibraries}
                center={userLocation}
                zoom={12}
                onLibraryClick={handleLibraryClick}
                className="h-[calc(100vh-200px)] rounded-lg overflow-hidden shadow-lg"
                showUserLocation={true}
                userLocation={userLocation}
              />
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredLibraries.map((library) => (
                <LibraryCard
                  key={library.id}
                  library={library}
                  onClick={() => handleLibraryClick(library)}
                  showDistance={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibraries.map((library) => (
              <LibraryCard
                key={library.id}
                library={library}
                onClick={() => handleLibraryClick(library)}
                showDistance={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
