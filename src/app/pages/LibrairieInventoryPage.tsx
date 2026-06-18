import { useState } from 'react';
import { CATEGORIES } from '../data/mockData';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Minus, Search, Edit3, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useLibraryProducts } from '../context/LibraryProductsContext';

export function LibrairieInventoryPage() {
  const { formatPrice, language } = useLocalization();
  const { user } = useAuth();
  const { libraryProducts: allProducts, updateProduct } = useLibraryProducts();

  const libraryId = user?.id || 'lib-1';
  const libraryProducts = allProducts.filter(p => p.librarieId === libraryId && p.active);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockQuantity, setStockQuantity] = useState(0);

  const handleUpdateStock = (productId: string, change: number) => {
    const product = libraryProducts.find(p => p.id === productId);
    if (!product) return;
    updateProduct(productId, { stock: Math.max(0, product.stock + change) });
    toast.success(language === 'fr' ? 'Stock mis à jour' : 'Stock updated');
  };

  const handleOpenStockModal = (product: any) => {
    setSelectedProduct(product);
    setStockQuantity(0);
    setShowStockModal(true);
  };

  const handleAddBulkStock = () => {
    if (stockQuantity <= 0) {
      toast.error(language === 'fr' ? 'Veuillez entrer une quantité valide' : 'Please enter a valid quantity');
      return;
    }

    updateProduct(selectedProduct.id, { stock: selectedProduct.stock + stockQuantity });
    toast.success(language === 'fr' ? `+${stockQuantity} ajoutés au stock` : `+${stockQuantity} added to stock`);
    setShowStockModal(false);
    setSelectedProduct(null);
    setStockQuantity(0);
  };

  // Filter products
  let filteredProducts = libraryProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStock === 'all' ? true :
      filterStock === 'low' ? product.stock > 0 && product.stock < 5 :
      filterStock === 'out' ? product.stock === 0 :
      true;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalValue = libraryProducts.reduce((sum, p) => sum + (p.salePrice || 0) * p.stock, 0);
  const totalItems = libraryProducts.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = libraryProducts.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStockCount = libraryProducts.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Bulk Stock Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {language === 'fr' ? 'Ajouter du stock' : 'Add Stock'}
              </h3>
              <button
                onClick={() => setShowStockModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4 p-4 bg-muted rounded-lg">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium">{selectedProduct.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Stock actuel:' : 'Current stock:'} {selectedProduct.stock}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'fr' ? 'Quantité à ajouter' : 'Quantity to add'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockQuantity || ''}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-lg font-medium"
                  placeholder="0"
                  autoFocus
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'fr' ? 'Nouveau stock:' : 'New stock:'} {selectedProduct.stock + (stockQuantity || 0)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStockModal(false)}
                className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleAddBulkStock}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {language === 'fr' ? 'Confirmer' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestion du Stock</h1>
              <p className="text-sm text-muted-foreground">
                Suivez et gérez vos niveaux de stock en temps réel
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valeur Totale</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Articles en Stock</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stock Faible</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rupture Stock</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6 animate-slide-in-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Rechercher un produit..."
                />
              </div>
            </div>

            {/* Filter by stock */}
            <div>
              <label className="block text-sm font-medium mb-2">Filtrer par stock</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStock('all')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStock === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStock('low')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStock === 'low'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Stock Faible
                </button>
                <button
                  onClick={() => setFilterStock('out')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStock === 'out'
                      ? 'bg-red-600 text-white'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Rupture
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prix Unitaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valeur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const stockValue = (product.salePrice || 0) * product.stock;
                  const stockStatus =
                    product.stock === 0 ? 'out' :
                    product.stock < 5 ? 'low' :
                    'good';

                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
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
                        <span className="text-sm">
                          {CATEGORIES.find(c => c.id === product.categoryId)?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">
                          {product.salePrice ? formatPrice(product.salePrice) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            stockStatus === 'out' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            stockStatus === 'low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {product.stock}
                          </span>
                          {stockStatus === 'out' && (
                            <span className="text-xs text-red-600">Rupture</span>
                          )}
                          {stockStatus === 'low' && (
                            <span className="text-xs text-yellow-600">Faible</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{formatPrice(stockValue)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(product.id, -1)}
                            disabled={product.stock === 0}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={language === 'fr' ? 'Retirer 1' : 'Remove 1'}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStock(product.id, 1)}
                            className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-colors"
                            title={language === 'fr' ? 'Ajouter 1' : 'Add 1'}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenStockModal(product)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                            title={language === 'fr' ? 'Modifier en masse' : 'Bulk edit'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
