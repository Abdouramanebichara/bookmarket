import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { Librairie } from '../types';

interface MapProps {
  libraries: Librairie[];
  center?: [number, number];
  zoom?: number;
  onLibraryClick?: (library: Librairie) => void;
  className?: string;
  showUserLocation?: boolean;
  userLocation?: [number, number];
}

function getLibraryLatLng(library: Librairie): [number, number] {
  return [
    library.latitude ?? library.location.latitude,
    library.longitude ?? library.location.longitude,
  ];
}

function getGoogleMapsUrl(library: Librairie) {
  const [lat, lng] = getLibraryLatLng(library);
  const label = encodeURIComponent(library.googleMapsQuery || library.name);
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}(${label})`;
}

function FitMapBounds({ libraries, userLocation }: { libraries: Librairie[]; userLocation?: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    const points = libraries.map(getLibraryLatLng);
    if (userLocation) points.push(userLocation);

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
    }
  }, [libraries, map, userLocation]);

  return null;
}

export function Map({
  libraries,
  center,
  zoom = 13,
  onLibraryClick,
  className = 'h-[500px]',
  showUserLocation = false,
  userLocation,
}: MapProps) {
  const mapCenter = center || userLocation || [3.8480, 11.5021];

  return (
    <div className={`${className} bg-muted rounded-lg overflow-hidden relative border border-border`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapBounds libraries={libraries} userLocation={showUserLocation ? userLocation : undefined} />

        {showUserLocation && userLocation && (
          <CircleMarker
            center={userLocation}
            radius={9}
            pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.8 }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">Votre position</p>
                <p className="text-xs text-gray-600">Point GPS détecté par le navigateur</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {libraries.map((library) => {
          const [lat, lng] = getLibraryLatLng(library);
          return (
            <CircleMarker
              key={library.id}
              center={[lat, lng]}
              radius={10}
              eventHandlers={{
                click: () => onLibraryClick?.(library),
              }}
              pathOptions={{ color: '#F97316', fillColor: '#F97316', fillOpacity: 0.9 }}
            >
              <Popup>
                <div className="w-64 space-y-3">
                  <div className="flex gap-3">
                    {library.logo && (
                      <img src={library.logo} alt={library.name} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight">{library.name}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{library.address || library.location.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onLibraryClick?.(library)}
                      className="flex-1 rounded-lg bg-[#0D1B3E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0D1B3E]/90"
                    >
                      Voir boutique
                    </button>
                    <a
                      href={getGoogleMapsUrl(library)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <a
        href="https://www.google.com/maps/search/librairie+Cameroun/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-[400] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg hover:bg-white"
      >
        <Navigation className="w-4 h-4" />
        Ouvrir Google Maps
      </a>
    </div>
  );
}
