import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLibraryProducts } from '../context/LibraryProductsContext';
import { CATEGORIES } from '../data/mockData';
import { Package, Plus, Edit, Eye, Search, Filter, TrendingUp, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalization } from '../context/LocalizationContext';

export function LibrairieProductsPage() {
  const navigate = useNavigate();
  const { formatPrice } = useLocalization();
  const { user } = useAuth();
  const { getLibraryProducts, toggleProductActive } = useLibraryProducts();

  const libraryId = user?.id || 'lib-1';
  const products = getLibraryProducts(libraryId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const handleToggleActive = (productId: string, currentActive: boolean) => {
    toggleProductActive(productId);
    toast.success(currentActive ? 'Produit désactivé' : 'Produit réactivé');
  };

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesType = !selectedType || product.type === selectedType;
    const matchesActive = showInactive ? true : product.active;
    return matchesSearch && matchesCategory && matchesType && matchesActive;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const lowStockProducts = products.filter(p => p.active && p.stock > 0 && p.stock < 5).length;
  const outOfStockProducts = products.filter(p => p.active && p.stock === 0).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Mes Produits</h1>
                <p className="text-sm text-muted-foreground">Gérez votre catalogue</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/librairie/products/new')}
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Actifs</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeProducts}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Stock faible</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockProducts}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Rupture</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{outOfStockProducts}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Titre, auteur..."
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Toutes les catégories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tous les types</option>
              <option value="sale">Vente</option>
              <option value="rental">Location</option>
              <option value="digital">Numérique</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Afficher les désactivés</span>
            </label>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bénéfice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-muted/30 transition-colors ${!product.active ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          {product.author && (
                            <div className="text-sm text-muted-foreground">{product.author}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{CATEGORIES.find(c => c.id === product.categoryId)?.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {product.salePrice ? (
                        <div>
                          <div className="font-medium">{formatPrice(product.salePrice)}</div>
                          <div className="text-xs text-muted-foreground">Achat : {formatPrice(product.purchasePrice || 0)}</div>
                        </div>
                      ) : product.rentalPricePerDay ? (
                        <div>
                          <div className="text-sm text-muted-foreground">{formatPrice(product.rentalPricePerDay)}/j</div>
                          <div className="text-xs text-muted-foreground">Achat : {formatPrice(product.purchasePrice || 0)}</div>
                        </div>
                      ) : product.digitalPrice ? (
                        <div className="text-sm text-purple-600">{formatPrice(product.digitalPrice)} (PDF)</div>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {product.salePrice && product.purchasePrice !== undefined ? (
                        <div>
                          <div className="font-semibold text-emerald-600">{formatPrice(Math.max(0, product.salePrice - (product.purchasePrice || 0)))}</div>
                          <div className="text-xs text-muted-foreground">par article</div>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 5 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {product.active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/librairie/products/${product.id}/edit`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id, product.active)}
                          className={`p-2 rounded-lg transition-colors ${
                            product.active
                              ? 'hover:bg-orange-50 text-orange-600 dark:hover:bg-orange-900/20'
                              : 'hover:bg-green-50 text-green-600 dark:hover:bg-green-900/20'
                          }`}
                          title={product.active ? 'Désactiver' : 'Réactiver'}
                        >
                          {product.active
                            ? <ToggleRight className="w-5 h-5" />
                            : <ToggleLeft className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun produit trouvé</p>
              <button
                onClick={() => navigate('/librairie/products/new')}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ajouter votre premier produit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
