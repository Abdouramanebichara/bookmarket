import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useLibraryProducts, LibraryProduct } from '../context/LibraryProductsContext';
import {
  FileText, Search, Download, Eye, ToggleRight, ToggleLeft,
  Plus, TrendingUp, DollarSign, Package, Edit2, Filter,
  BookOpen, Star, ArrowUpRight
} from 'lucide-react';

type SortField = 'title' | 'digitalPrice' | 'downloads' | 'createdAt';
type SortDir = 'asc' | 'desc';

export function LibrairieDigitalProductsPage() {
  const navigate = useNavigate();
  const { formatPrice, language } = useLocalization();
  const { user } = useAuth();
  const { libraryProducts, toggleProductActive, updateProduct } = useLibraryProducts();

  const fr = language === 'fr';
  const libraryId = user?.id || 'lib-1';

  // Only products that have a digital price (PDF version)
  const digitalProducts = useMemo(() =>
    libraryProducts.filter(p => p.librarieId === libraryId && p.digitalPrice && p.digitalPrice > 0),
    [libraryProducts, libraryId]
  );

  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [editPriceId, setEditPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState(0);

  const filtered = useMemo(() => {
    let list = digitalProducts.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.author || '').toLowerCase().includes(search.toLowerCase());
      const matchActive = showInactive ? true : p.active;
      return matchSearch && matchActive;
    });

    list = [...list].sort((a, b) => {
      let va: any, vb: any;
      if (sortField === 'title') { va = a.title; vb = b.title; }
      else if (sortField === 'digitalPrice') { va = a.digitalPrice || 0; vb = b.digitalPrice || 0; }
      else if (sortField === 'downloads') { va = 0; vb = 0; } // placeholder
      else { va = a.createdAt; vb = b.createdAt; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [digitalProducts, search, showInactive, sortField, sortDir]);

  // KPIs
  const activeCount = digitalProducts.filter(p => p.active).length;
  const totalRevenuePotential = digitalProducts
    .filter(p => p.active)
    .reduce((s, p) => s + (p.digitalPrice || 0), 0);
  const avgPrice = activeCount > 0
    ? Math.round(totalRevenuePotential / activeCount)
    : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleSavePrice = (id: string) => {
    if (editPriceValue > 0) {
      updateProduct(id, { digitalPrice: editPriceValue });
    }
    setEditPriceId(null);
  };

  const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors ${
        sortField === field ? 'text-orange-600' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      <span className="text-xs">{sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {fr ? 'Produits Numériques' : 'Digital Products'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {fr
                  ? 'Gérez vos livres et documents vendus en PDF'
                  : 'Manage your books and documents sold as PDF'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/librairie/products/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {fr ? 'Ajouter un produit' : 'Add Product'}
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-5 text-white shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">{fr ? 'Produits PDF' : 'PDF Products'}</span>
              <FileText className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold">{digitalProducts.length}</p>
            <p className="text-xs opacity-75 mt-1">{activeCount} {fr ? 'actifs' : 'active'}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{fr ? 'Prix moyen' : 'Avg. Price'}</span>
              <DollarSign className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(avgPrice)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fr ? 'par PDF' : 'per PDF'}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{fr ? 'Valeur catalogue' : 'Catalog Value'}</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{formatPrice(totalRevenuePotential)}</p>
            <p className="text-xs text-muted-foreground mt-1">{fr ? 'total prix PDF' : 'total PDF price'}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{fr ? 'Désactivés' : 'Inactive'}</span>
              <Package className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-500">{digitalProducts.length - activeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{fr ? 'non visibles' : 'not visible'}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={fr ? 'Rechercher un produit PDF…' : 'Search a PDF product…'}
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium select-none">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={e => setShowInactive(e.target.checked)}
              className="w-4 h-4 accent-orange-600"
            />
            {fr ? 'Afficher les désactivés' : 'Show inactive'}
          </label>
        </div>

        {/* Empty state */}
        {digitalProducts.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-16 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {fr ? 'Aucun produit numérique' : 'No digital products'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {fr
                ? 'Ajoutez un produit (livre, document…) et activez la version PDF dans le formulaire.'
                : 'Add a product (book, document…) and enable the PDF version in the form.'}
            </p>
            <button
              onClick={() => navigate('/librairie/products/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              {fr ? 'Ajouter un produit PDF' : 'Add PDF Product'}
            </button>
          </div>
        )}

        {/* Product grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(product => (
              <DigitalProductCard
                key={product.id}
                product={product}
                fr={fr}
                formatPrice={formatPrice}
                editPriceId={editPriceId}
                editPriceValue={editPriceValue}
                onEditPrice={() => { setEditPriceId(product.id); setEditPriceValue(product.digitalPrice || 0); }}
                onSavePrice={() => handleSavePrice(product.id)}
                onCancelEdit={() => setEditPriceId(null)}
                onPriceChange={setEditPriceValue}
                onToggle={() => toggleProductActive(product.id)}
                onEdit={() => navigate(`/librairie/products/${product.id}/edit`)}
              />
            ))}
          </div>
        )}

        {/* No results but products exist */}
        {digitalProducts.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {fr ? 'Aucun résultat pour cette recherche' : 'No results for this search'}
            </p>
          </div>
        )}

        {/* Table header for sorting (shown only when there are results) */}
        {filtered.length > 1 && (
          <div className="flex items-center gap-4 px-2 text-xs">
            <span className="text-muted-foreground">{fr ? 'Trier par :' : 'Sort by:'}</span>
            <SortBtn field="title" label={fr ? 'Titre' : 'Title'} />
            <SortBtn field="digitalPrice" label={fr ? 'Prix PDF' : 'PDF Price'} />
            <SortBtn field="createdAt" label={fr ? 'Date' : 'Date'} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Card component ── */
function DigitalProductCard({
  product, fr, formatPrice,
  editPriceId, editPriceValue,
  onEditPrice, onSavePrice, onCancelEdit, onPriceChange,
  onToggle, onEdit,
}: {
  product: LibraryProduct;
  fr: boolean;
  formatPrice: (n: number) => string;
  editPriceId: string | null;
  editPriceValue: number;
  onEditPrice: () => void;
  onSavePrice: () => void;
  onCancelEdit: () => void;
  onPriceChange: (v: number) => void;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const isEditing = editPriceId === product.id;
  const hasPhysical = (product.salePrice || 0) > 0;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all hover:shadow-md ${
      !product.active ? 'opacity-55 border-border' : 'border-border hover:border-violet-300'
    }`}>
      {/* Cover */}
      <div className="relative aspect-[3/2] bg-purple-50 dark:bg-purple-950/20 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-violet-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-violet-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <FileText className="w-3 h-3" /> PDF
          </span>
          {hasPhysical && (
            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {fr ? 'Physique' : 'Physical'}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="absolute top-2 right-2">
          {product.active ? (
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {fr ? 'Actif' : 'Active'}
            </span>
          ) : (
            <span className="bg-gray-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {fr ? 'Inactif' : 'Inactive'}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold line-clamp-2 mb-1">{product.title}</h3>
        {product.author && (
          <p className="text-sm text-muted-foreground mb-3">{product.author}</p>
        )}

        {/* Prices */}
        <div className="flex items-center gap-3 mb-3">
          {/* PDF Price — editable */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">{fr ? 'Prix PDF' : 'PDF Price'}</p>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editPriceValue}
                  onChange={e => onPriceChange(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-sm bg-background border border-violet-500 rounded focus:outline-none"
                  min={0} step={100} autoFocus
                />
                <button onClick={onSavePrice} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  ✓
                </button>
                <button onClick={onCancelEdit} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors">
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={onEditPrice}
                className="flex items-center gap-1 group"
              >
                <span className="font-bold text-violet-600">{formatPrice(product.digitalPrice || 0)}</span>
                <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          {hasPhysical && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{fr ? 'Prix physique' : 'Physical'}</p>
              <p className="font-medium text-sm">{formatPrice(product.salePrice || 0)}</p>
            </div>
          )}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewsCount})</span>
          </div>
        )}

        {/* Discount badge */}
        {hasPhysical && product.digitalPrice && product.salePrice && product.digitalPrice < product.salePrice && (
          <div className="mb-3 px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-700 dark:text-green-300">
              {Math.round((1 - product.digitalPrice / product.salePrice) * 100)}% {fr ? 'moins cher que le physique' : 'cheaper than physical'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            {fr ? 'Modifier' : 'Edit'}
          </button>

          <button
            onClick={onToggle}
            title={product.active ? (fr ? 'Désactiver' : 'Deactivate') : (fr ? 'Activer' : 'Activate')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              product.active
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40'
                : 'bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40'
            }`}
          >
            {product.active
              ? <ToggleRight className="w-4 h-4" />
              : <ToggleLeft className="w-4 h-4" />}
            {product.active ? (fr ? 'Désact.' : 'Deact.') : (fr ? 'Activer' : 'Activate')}
          </button>
        </div>
      </div>
    </div>
  );
}
