import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D1B3E] text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Column */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <span className="font-[var(--font-display)] font-bold text-2xl">
                  BookStore
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                La marketplace multi-librairies de velepper par les etudiant du 3gi dans le cadre du cour de reseau. Trouvez et commandez vos livres et fournitures préférés en quelques clics.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#F97316] rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#F97316] rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#F97316] rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-6">Liens rapides</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/')} className="text-gray-400 hover:text-[#F97316] transition-colors">
                    Accueil
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/explorer')} className="text-gray-400 hover:text-[#F97316] transition-colors">
                    Explorer les librairies
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/panier')} className="text-gray-400 hover:text-[#F97316] transition-colors">
                    Mon panier
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/notifications')} className="text-gray-400 hover:text-[#F97316] transition-colors">
                    Notifications
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 justify-center md:justify-start">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#F97316]" />
                  <span>ENSPY YAOUNDE CAMEROUN</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 justify-center md:justify-start">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[#F97316]" />
                  <a href="tel:676415996" className="hover:text-[#F97316] transition-colors">
                    676415996
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 justify-center md:justify-start">
                  <Mail className="w-5 h-5 flex-shrink-0 text-[#F97316]" />
                  <a href="mailto:groupereseau.enspy@gmail.com" className="hover:text-[#F97316] transition-colors">
                    groupereseau.enspy@gmail.com
                  </a>
                </li>
              </ul>

              {/* Newsletter */}
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Inscrivez-vous à notre newsletter</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] text-white placeholder:text-gray-500"
                  />
                  <button className="px-4 py-2 bg-[#F97316] hover:bg-[#ea6a0f] rounded-lg transition-all hover:scale-105">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-gray-400 text-sm">
            <p>© {currentYear} BookStore. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
