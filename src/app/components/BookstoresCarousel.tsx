import { useState, useRef } from 'react';
import { Star, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { MOCK_LIBRAIRIES, YAOUNDE_CENTER } from '../data/mockData';

interface Bookstore {
  id: string;
  name: string;
  image: string;
  logo: string;
  distance: string;
  city: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  isOpen: boolean;
  hasPromo?: boolean;
  promoText?: string;
}

const calculateDistance = (lat: number, lng: number) => {
  const R = 6371;
  const dLat = ((lat - YAOUNDE_CENTER.lat) * Math.PI) / 180;
  const dLng = ((lng - YAOUNDE_CENTER.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((YAOUNDE_CENTER.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const bookstores: Bookstore[] = MOCK_LIBRAIRIES.slice(0, 6).map((library, index) => {
  const lat = library.latitude ?? library.location.latitude;
  const lng = library.longitude ?? library.location.longitude;
  const distance = calculateDistance(lat, lng);

  return {
    id: library.id,
    name: library.name,
    image: library.banner || library.coverImage || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=450&fit=crop&auto=format',
    logo: library.logo || 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=200&fit=crop&auto=format',
    distance: `${distance.toFixed(1)} km`,
    city: library.city || library.location.city,
    rating: library.rating,
    reviews: library.reviewsCount,
    deliveryTime: index < 3 ? '20-35 min' : '30-45 min',
    isOpen: library.active,
    hasPromo: library.verified,
    promoText: 'Vérifiée',
  };
});

export function BookstoresCarousel() {
  const navigate = useNavigate();
  const { t } = useLocalization();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = container.children[0]?.clientWidth || 0;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(Math.min(bookstores.length - 1, currentIndex + 1));
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h2 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1B3E] mb-2 sm:mb-3">
            {t('nearbyBookstores')}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {t('openNow')}
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0D1B3E] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={currentIndex >= bookstores.length - 4}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0D1B3E] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8"
          >
            {bookstores.map((store) => (
              <div key={store.id} className="flex-shrink-0 w-[calc(25%-18px)] min-w-[280px]">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md ${
                          store.isOpen
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${store.isOpen ? 'bg-white' : 'bg-white'} animate-pulse`}></span>
                        {store.isOpen ? t('open') : t('closed')}
                      </div>
                    </div>

                    {/* Promo Badge */}
                    {store.hasPromo && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-[#F97316] text-white rounded-full text-xs font-bold backdrop-blur-md">
                          🏷️ {store.promoText}
                        </div>
                      </div>
                    )}

                    {/* Logo */}
                    <div className="absolute -bottom-6 left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl border-4 border-white">
                      <img src={store.logo} alt={store.name} className="w-full h-full rounded-lg object-cover" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-8">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{store.name}</h3>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{store.rating}</span>
                      <span className="text-gray-500 text-sm">({store.reviews} {t('reviews')})</span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{store.distance} · {store.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{t('delivery')} {store.deliveryTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/libraries/${store.id}`)}
                      className="w-full py-3 bg-[#0D1B3E] text-white font-semibold rounded-xl hover:bg-[#0D1B3E]/90 transition-all hover:shadow-lg group-hover:bg-[#F97316]"
                    >
                      {t('viewStore')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {bookstores.slice(0, -3).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const cardWidth = container.children[0]?.clientWidth || 0;
                    container.scrollTo({ left: index * (cardWidth + 24), behavior: 'smooth' });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-[#0D1B3E] w-8' : 'bg-[#0D1B3E]/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
