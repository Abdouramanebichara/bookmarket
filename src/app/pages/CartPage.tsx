import { useState } from 'react';
import { Package, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

export function CartPage() {
  const [activeTab, setActiveTab] = useState<'acheter' | 'louer'>('acheter');

  // Données de test
  const purchaseOrders = [
    {
      id: 1,
      name: 'Cahier Oxford A4',
      store: 'Librairie Excellence',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop',
      price: 2500,
      orderDate: '2026-05-15',
      expectedDelivery: '2026-05-20',
      status: 'en_attente',
    },
    {
      id: 2,
      name: 'Calculatrice Casio',
      store: 'Papeterie Moderna',
      image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2c8?w=400&h=400&fit=crop',
      price: 15000,
      orderDate: '2026-05-10',
      deliveryDate: '2026-05-12',
      status: 'livre',
    },
  ];

  const rentalOrders = [
    {
      id: 3,
      name: 'Tablette Samsung Galaxy',
      store: 'BookStore Premium',
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
      price: 12000,
      rentalDate: '2026-05-01',
      expectedDelivery: '2026-05-25',
      returnDate: '2026-06-01',
      status: 'en_attente',
      returned: false,
    },
    {
      id: 4,
      name: 'Projecteur HD',
      store: 'Librairie Moderna',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
      price: 15000,
      rentalDate: '2026-04-20',
      deliveryDate: '2026-04-22',
      returnDate: '2026-05-22',
      status: 'livre',
      returned: false,
    },
  ];

  const pendingPurchases = purchaseOrders.filter((o) => o.status === 'en_attente');
  const deliveredPurchases = purchaseOrders.filter((o) => o.status === 'livre');
  const pendingRentals = rentalOrders.filter((o) => o.status === 'en_attente');
  const deliveredRentals = rentalOrders.filter((o) => o.status === 'livre');

  return (
    <div className="min-h-screen bg-gray-50 pt-32 sm:pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <h1 className="font-[var(--font-display)] font-bold text-2xl sm:text-3xl md:text-4xl text-[#0D1B3E] mb-6 sm:mb-8">
          Mon Panier
        </h1>

        {/* Tabs Acheter / Louer */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('acheter')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-4 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'acheter'
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/30'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛒 Acheter
          </button>
          <button
            onClick={() => setActiveTab('louer')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-4 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'louer'
                ? 'bg-[#0D1B3E] text-white shadow-lg shadow-[#0D1B3E]/30'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📦 Louer
          </button>
        </div>

        {activeTab === 'acheter' ? (
          <div className="space-y-8">
            {/* En attente de livraison */}
            <section>
              <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                En attente de livraison ({pendingPurchases.length})
              </h2>
              <div className="grid gap-4">
                {pendingPurchases.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {order.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{order.store}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Commandé le {order.orderDate}
                          </span>
                          <span className="flex items-center gap-1 text-orange-600 font-medium">
                            <MapPin className="w-4 h-4" />
                            Livraison prévue: {order.expectedDelivery}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-[#0D1B3E] mb-2">
                          {order.price.toLocaleString()} FCFA
                        </p>
                        <span className="inline-flex px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          En cours
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Livrés */}
            <section>
              <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Livrés ({deliveredPurchases.length})
              </h2>
              <div className="grid gap-4">
                {deliveredPurchases.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 shadow-sm opacity-75"
                  >
                    <div className="flex gap-4">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {order.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{order.store}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Livré le {order.deliveryDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-600 mb-2">
                          {order.price.toLocaleString()} FCFA
                        </p>
                        <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          ✓ Livré
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8">
            {/* En attente de livraison (Location) */}
            <section>
              <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                En attente de livraison ({pendingRentals.length})
              </h2>
              <div className="grid gap-4">
                {pendingRentals.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {order.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{order.store}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Loué le {order.rentalDate}
                          </span>
                          <span className="flex items-center gap-1 text-orange-600 font-medium">
                            <MapPin className="w-4 h-4" />
                            Livraison: {order.expectedDelivery}
                          </span>
                          <span className="flex items-center gap-1 text-purple-600 font-medium">
                            <Package className="w-4 h-4" />
                            Retour prévu: {order.returnDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-[#0D1B3E] mb-1">
                          {order.price.toLocaleString()} FCFA
                          <span className="text-xs text-gray-500 font-normal">/mois</span>
                        </p>
                        <span className="inline-flex px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          En cours
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Livrés (Location) */}
            <section>
              <h2 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Livrés ({deliveredRentals.length})
              </h2>
              <div className="grid gap-4">
                {deliveredRentals.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {order.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{order.store}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Livré le {order.deliveryDate}
                          </span>
                          <span className="flex items-center gap-1 text-purple-600 font-medium">
                            <Package className="w-4 h-4" />
                            Retour prévu: {order.returnDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-600 mb-1">
                          {order.price.toLocaleString()} FCFA
                          <span className="text-xs text-gray-500 font-normal">/mois</span>
                        </p>
                        <div className="space-y-2">
                          <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            ✓ Livré
                          </span>
                          <br />
                          {order.returned ? (
                            <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              ✓ Rendu
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              ⏳ Non rendu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
