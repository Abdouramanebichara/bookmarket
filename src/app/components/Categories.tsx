import { BookOpen, Pen, Backpack, Ruler, Calculator, BookMarked, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Category {
  id: number;
  name: string;
  count: number;
  icon: React.ReactNode;
  image: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Livres & Romans',
    count: 12450,
    icon: <BookOpen className="w-12 h-12" />,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=800&fit=crop',
  },
  {
    id: 2,
    name: 'Papeterie',
    count: 8920,
    icon: <Pen className="w-12 h-12" />,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=800&fit=crop',
  },
  {
    id: 3,
    name: 'Fournitures scolaires',
    count: 15780,
    icon: <Backpack className="w-12 h-12" />,
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&h=800&fit=crop',
  },
  {
    id: 4,
    name: 'Supports didactiques',
    count: 5670,
    icon: <Ruler className="w-12 h-12" />,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
  },
  {
    id: 5,
    name: 'Calculatrices',
    count: 3240,
    icon: <Calculator className="w-12 h-12" />,
    image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2c8?w=1200&h=800&fit=crop',
  },
  {
    id: 6,
    name: 'Cahiers & Classeurs',
    count: 9850,
    icon: <BookMarked className="w-12 h-12" />,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&h=800&fit=crop',
  },
];

export function Categories() {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1B3E] mb-2 sm:mb-3">
            Explorez par catégorie
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Des milliers de produits organisés pour faciliter votre recherche
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/recherche?q=${encodeURIComponent(category.name)}`)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer h-48 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:from-black/70 transition-all"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
                <div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all border border-white/20">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-2 drop-shadow-lg">{category.name}</h3>
                  <p className="text-white/90 text-sm drop-shadow">
                    {category.count.toLocaleString()} produits
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 font-semibold group-hover:gap-4 transition-all drop-shadow">
                  <span>Explorer</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 bg-primary rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-20 w-40 h-40 bg-[#F97316] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h3 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Contactez-nous et nous vous aiderons à trouver exactement ce dont vous avez besoin
            </p>
            <button className="px-8 sm:px-10 py-3 sm:py-4 bg-[#F97316] hover:bg-[#ea6a0f] text-white font-bold rounded-xl transition-all hover:shadow-2xl hover:shadow-[#F97316]/30 active:scale-95 sm:hover:scale-105 text-sm sm:text-base">
              Contactez-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
