import { Package, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-primary overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-32">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#F97316] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500 rounded-full blur-[100px]"></div>
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-primary/10"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="font-[var(--font-display)] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                Trouvez vos livres et{' '}
                <span className="text-[#F97316] relative inline-block">
                  fournitures
                  <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M0 4 Q100 0, 200 4" stroke="#F97316" strokeWidth="2" fill="none" opacity="0.5"/>
                  </svg>
                </span>
                {' '}près de chez vous
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl">
                Découvrez plus de 200 librairies partenaires dans toute l'Afrique. Commandez en ligne, recevez rapidement.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#0D1B3E] border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#0D1B3E] transition-all shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 text-sm sm:text-base">
                Commander maintenant
              </button>
              <button
                onClick={() => navigate('/explorer')}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-[#0D1B3E] transition-all text-sm sm:text-base"
              >
                Explorer les librairies
              </button>
            </div>
          </div>

          {/* Right Column - Illustration & Stats */}
          <div className="relative hidden lg:block">
            {/* Main Illustration Placeholder */}
            <div className="relative w-full h-[500px] rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-8xl">📚</div>
                <div className="text-white/60 text-lg">Illustration moderne</div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -left-8 top-1/4 animate-float">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F97316]/20 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-2xl">200+</div>
                    <div className="text-sm text-gray-300">Librairies partenaires</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 top-1/3 animate-float-delayed">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-2xl">50k+</div>
                    <div className="text-sm text-gray-300">Utilisateurs actifs</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-1/4 bottom-8 animate-float">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-2xl">98%</div>
                    <div className="text-sm text-gray-300">Livraisons à temps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
