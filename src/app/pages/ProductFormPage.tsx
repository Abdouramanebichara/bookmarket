import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { useLibraryProducts } from '../context/LibraryProductsContext';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockData';
import {
  Package, Upload, Save, X, FileText, DollarSign, Box,
  BookOpen, User, Settings, CheckCircle, Disc, Film,
  Calculator, Layers, Tag, Image, Info, ChevronRight,
  Hash, Globe, AlignLeft, ListOrdered, Cpu, Music,
  Monitor, Wrench, Repeat
} from 'lucide-react';
import { toast } from 'sonner';

type ProductKind = 'book' | 'textbook' | 'cd' | 'dvd' | 'supplies' | 'calculator' | 'document' | 'other';
type SaleType = 'sale' | 'rental' | 'both' | 'digital_only';
type TabType = 'basic' | 'pricing' | 'description' | 'technical' | 'author' | 'digital' | 'stock';

const PRODUCT_KIND_CONFIG: Record<ProductKind, {
  icon: any;
  labelFr: string;
  labelEn: string;
  color: string;
  showAuthor: boolean;
  showISBN: boolean;
  showPages: boolean;
  showCover: boolean;
  showDigital: boolean;
  showMedia: boolean;
  showSpecs: boolean;
  showCalculator: boolean;
  tabs: TabType[];
}> = {
  book: {
    icon: BookOpen, labelFr: 'Livre', labelEn: 'Book',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    showAuthor: true, showISBN: true, showPages: true, showCover: true,
    showDigital: true, showMedia: false, showSpecs: false, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'author', 'digital', 'stock'],
  },
  textbook: {
    icon: Layers, labelFr: 'Manuel scolaire', labelEn: 'Textbook',
    color: 'bg-green-100 text-green-700 border-green-300',
    showAuthor: true, showISBN: true, showPages: true, showCover: true,
    showDigital: true, showMedia: false, showSpecs: false, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'author', 'digital', 'stock'],
  },
  document: {
    icon: FileText, labelFr: 'Document / Revue', labelEn: 'Document / Journal',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    showAuthor: true, showISBN: false, showPages: true, showCover: false,
    showDigital: true, showMedia: false, showSpecs: false, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'author', 'digital', 'stock'],
  },
  cd: {
    icon: Disc, labelFr: 'CD Audio', labelEn: 'CD Audio',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    showAuthor: false, showISBN: false, showPages: false, showCover: false,
    showDigital: false, showMedia: true, showSpecs: false, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'stock'],
  },
  dvd: {
    icon: Film, labelFr: 'DVD / Blu-ray', labelEn: 'DVD / Blu-ray',
    color: 'bg-red-100 text-red-700 border-red-300',
    showAuthor: false, showISBN: false, showPages: false, showCover: false,
    showDigital: false, showMedia: true, showSpecs: false, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'stock'],
  },
  supplies: {
    icon: Package, labelFr: 'Fourniture scolaire', labelEn: 'School Supply',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    showAuthor: false, showISBN: false, showPages: false, showCover: false,
    showDigital: false, showMedia: false, showSpecs: true, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'stock'],
  },
  calculator: {
    icon: Calculator, labelFr: 'Calculatrice', labelEn: 'Calculator',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    showAuthor: false, showISBN: false, showPages: false, showCover: false,
    showDigital: false, showMedia: false, showSpecs: true, showCalculator: true,
    tabs: ['basic', 'pricing', 'description', 'technical', 'stock'],
  },
  other: {
    icon: Wrench, labelFr: 'Autre', labelEn: 'Other',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    showAuthor: false, showISBN: false, showPages: false, showCover: false,
    showDigital: false, showMedia: false, showSpecs: true, showCalculator: false,
    tabs: ['basic', 'pricing', 'description', 'technical', 'stock'],
  },
};

const ALLOWED_EXAMS = ['BAC', 'BEP', 'CAP', 'BEPC', 'GCE O/L', 'GCE A/L', 'Licence', 'Master'];
const MUSIC_GENRES = ['Classique', 'Jazz', 'Pop', 'Rock', 'R&B', 'Hip-hop', 'Gospel', 'Afrobeat', 'Makossa', 'Bikutsi', 'Autres'];
const FILM_GENRES = ['Action', 'Comédie', 'Drame', 'Documentaire', 'Animation', 'Thriller', 'Horreur', 'Science-fiction', 'Romance', 'Éducatif'];

export function ProductFormPage() {
  const navigate = useNavigate();
  const { language } = useLocalization();
  const { user } = useAuth();
  const { addProduct, updateProduct, libraryProducts } = useLibraryProducts();
  const { id } = useParams();
  const isEdit = !!id;

  const existingProduct = isEdit
    ? (libraryProducts.find(p => p.id === id) || MOCK_PRODUCTS.find(p => p.id === id))
    : null;

  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [productKind, setProductKind] = useState<ProductKind>('book');
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // === Commun ===
    title: existingProduct?.title || '',
    categoryId: existingProduct?.categoryId || '',
    saleType: 'sale' as SaleType,
    coverImageUrl: '',

    // === Prix & Stock ===
    salePrice: existingProduct?.salePrice || 0,
    purchasePrice: existingProduct?.purchasePrice || 0,
    rentalPricePerDay: existingProduct?.rentalPricePerDay || 0,
    digitalPrice: 0,
    stock: existingProduct?.stock || 0,
    minStockAlert: 5,
    availability: 'available' as 'available' | 'out_of_stock' | 'coming_soon' | 'pre_order',

    // === Description ===
    shortSummary: existingProduct?.description?.substring(0, 200) || '',
    detailedDescription: existingProduct?.description || '',
    targetAudience: '',
    tableOfContents: '',
    keywords: '',

    // === Livre / Textbook / Document ===
    author: existingProduct?.author || '',
    coAuthors: '',
    translator: '',
    publisher: existingProduct?.publisher || '',
    collection: '',
    bookLanguage: 'fr',
    isbn: existingProduct?.isbn || '',
    ean: '',
    pageCount: 0,
    coverType: 'paperback' as 'paperback' | 'hardcover' | 'spiral' | 'digital' | 'ebook',
    publicationDate: '',
    edition: '1',
    interiorColor: 'bw' as 'bw' | 'color' | 'mixed',
    dimensions: '',
    weight: 0,
    level: '' as '' | 'beginner' | 'intermediate' | 'advanced' | 'school' | 'university' | 'professional',
    domain: '',
    authorBio: '',

    // === Version numérique ===
    hasDigitalVersion: false,
    digitalPageCount: 0,
    digitalAccess: 'lifetime' as 'lifetime' | 'limited',

    // === CD / DVD ===
    artist: '',
    label: '',
    trackCount: 0,
    cdDuration: '',
    genre: '',
    director: '',
    studio: '',
    durationMinutes: 0,
    pegiRating: '' as '' | 'TP' | '10' | '12' | '16' | '18',
    originalLanguage: '',
    subtitles: '',

    // === Fournitures / Calculatrice ===
    brand: '',
    model: '',
    reference: '',
    dimensions2: '',
    weight2: 0,
    material: '',
    color: '',
    warranty: '',

    // === Calculatrice spécifique ===
    isGraphing: false,
    isSolar: false,
    allowedExams: [] as string[],
    batteryType: '',
    displayLines: 0,
  });

  const cfg = PRODUCT_KIND_CONFIG[productKind];

  const update = (patch: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...patch }));

  const toggleExam = (exam: string) => {
    const next = formData.allowedExams.includes(exam)
      ? formData.allowedExams.filter(e => e !== exam)
      : [...formData.allowedExams, exam];
    update({ allowedExams: next });
  };

  const handleCoverImageUrl = (url: string) => {
    update({ coverImageUrl: url });
    setCoverImagePreview(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      update({ coverImageUrl: dataUrl });
      setCoverImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error(language === 'fr' ? 'Le titre est obligatoire' : 'Title is required');
      return;
    }
    if (!formData.categoryId) {
      toast.error(language === 'fr' ? 'Veuillez sélectionner une catégorie' : 'Please select a category');
      return;
    }
    if (formData.salePrice <= 0 && formData.saleType !== 'rental' && !isDigitalOnly) {
      toast.error(language === 'fr' ? 'Le prix de vente doit être supérieur à 0' : 'Sale price must be greater than 0');
      return;
    }
    if (!isDigitalOnly && formData.purchasePrice < 0) {
      toast.error(language === 'fr' ? 'Le prix d’achat ne peut pas être négatif' : 'Purchase price cannot be negative');
      return;
    }
    if (!isDigitalOnly && formData.salePrice > 0 && formData.purchasePrice > formData.salePrice) {
      toast.error(language === 'fr' ? 'Le prix d’achat ne doit pas dépasser le prix de vente' : 'Purchase price cannot exceed sale price');
      return;
    }
    if (isDigitalOnly && formData.digitalPrice <= 0) {
      toast.error(language === 'fr' ? 'Veuillez indiquer le prix du PDF' : 'Please enter the PDF price');
      return;
    }

    const libraryId = user?.id || 'lib-1';
    const defaultImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300';
    const images = formData.coverImageUrl ? [formData.coverImageUrl] : [defaultImage];

    const productData = {
      title: formData.title,
      type: (formData.saleType === 'digital_only' ? 'sale' : formData.saleType) as any,
      categoryId: formData.categoryId,
      author: cfg.showAuthor ? (formData.author || undefined) : undefined,
      publisher: cfg.showAuthor ? (formData.publisher || undefined) : undefined,
      isbn: cfg.showISBN ? (formData.isbn || undefined) : undefined,
      description: formData.detailedDescription || formData.shortSummary,
      salePrice: (formData.saleType === 'sale' || formData.saleType === 'both') ? formData.salePrice : undefined,
      purchasePrice: !isDigitalOnly ? formData.purchasePrice : undefined,
      rentalPricePerDay: (formData.saleType === 'rental' || formData.saleType === 'both') ? formData.rentalPricePerDay : undefined,
      digitalPrice: (formData.saleType === 'digital_only' || formData.hasDigitalVersion) ? formData.digitalPrice : undefined,
      stock: isDigitalOnly ? 0 : formData.stock,
      images,
      librarieId: libraryId,
      condition: 'new' as const,
    };

    if (isEdit && id) {
      updateProduct(id, productData);
      toast.success(language === 'fr' ? 'Produit mis à jour !' : 'Product updated!');
    } else {
      addProduct(productData);
      toast.success(language === 'fr' ? 'Produit ajouté avec succès !' : 'Product added successfully!');
    }
    navigate('/librairie/products');
  };

  const isDigitalOnly = formData.saleType === 'digital_only';

  const ALL_TABS: { id: TabType; labelFr: string; labelEn: string; icon: any; check?: () => boolean }[] = [
    { id: 'basic', labelFr: 'Informations', labelEn: 'Information', icon: Info, check: () => !!formData.title && !!formData.categoryId },
    { id: 'pricing', labelFr: 'Prix & Stock', labelEn: 'Pricing & Stock', icon: DollarSign, check: () => formData.salePrice > 0 || formData.purchasePrice > 0 || formData.rentalPricePerDay > 0 || formData.digitalPrice > 0 },
    { id: 'description', labelFr: 'Description', labelEn: 'Description', icon: AlignLeft, check: () => !!formData.shortSummary || !!formData.detailedDescription },
    { id: 'technical', labelFr: 'Caractéristiques', labelEn: 'Specifications', icon: Settings },
    { id: 'author', labelFr: 'Auteur & Éditeur', labelEn: 'Author & Publisher', icon: User },
    { id: 'digital', labelFr: 'Version PDF', labelEn: 'PDF Version', icon: FileText },
    { id: 'stock', labelFr: 'Stock', labelEn: 'Stock', icon: Box },
  ];

  const visibleTabs = ALL_TABS.filter(t => {
    if (t.id === 'stock' && isDigitalOnly) return false;
    return cfg.tabs.includes(t.id);
  });

  const inputCls = 'w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors';
  const labelCls = 'block text-sm font-medium mb-2';
  const sectionTitle = (fr: string, en: string) => (
    <h3 className="text-lg font-bold mb-6 pb-2 border-b border-border flex items-center gap-2">
      {language === 'fr' ? fr : en}
    </h3>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {isEdit
                  ? (language === 'fr' ? 'Modifier le produit' : 'Edit Product')
                  : (language === 'fr' ? 'Ajouter un produit' : 'Add Product')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Remplissez les informations adaptées à votre produit' : 'Fill in the fields adapted to your product'}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/librairie/products')} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const done = tab.check?.();
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-card border border-border hover:border-orange-400 hover:text-orange-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {language === 'fr' ? tab.labelFr : tab.labelEn}
                {done && !isActive && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-xl border border-border p-6 mb-6 min-h-[500px]">

            {/* ── TAB: Informations ── */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {sectionTitle('Type de produit', 'Product Type')}

                {/* Kind picker */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {(Object.keys(PRODUCT_KIND_CONFIG) as ProductKind[]).map(kind => {
                    const Icon = PRODUCT_KIND_CONFIG[kind].icon;
                    const active = productKind === kind;
                    return (
                      <button
                        key={kind}
                        type="button"
                        onClick={() => { setProductKind(kind); setActiveTab('basic'); }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          active
                            ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/20'
                            : 'border-border hover:border-orange-300 bg-background'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${active ? 'text-orange-600' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium text-center ${active ? 'text-orange-600' : ''}`}>
                          {language === 'fr' ? PRODUCT_KIND_CONFIG[kind].labelFr : PRODUCT_KIND_CONFIG[kind].labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className={labelCls}>
                      {language === 'fr' ? 'Titre du produit' : 'Product Title'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => update({ title: e.target.value })}
                      className={inputCls}
                      placeholder={
                        productKind === 'book' ? (language === 'fr' ? 'Ex: Python pour les nuls' : 'Ex: Python for Beginners')
                        : productKind === 'calculator' ? 'Ex: Casio FX-991EX'
                        : productKind === 'cd' ? (language === 'fr' ? 'Ex: Best of Makossa Vol.2' : 'Ex: Greatest Hits Vol.2')
                        : productKind === 'dvd' ? (language === 'fr' ? 'Ex: La Leçon de Chimie' : 'Ex: Chemistry Lesson')
                        : productKind === 'supplies' ? (language === 'fr' ? 'Ex: Règle 30cm Maped' : 'Ex: Maped 30cm Ruler')
                        : (language === 'fr' ? 'Nom du produit' : 'Product name')
                      }
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className={labelCls}>
                      {language === 'fr' ? 'Catégorie' : 'Category'} <span className="text-red-500">*</span>
                    </label>
                    <select value={formData.categoryId} onChange={e => update({ categoryId: e.target.value })} className={inputCls} required>
                      <option value="">{language === 'fr' ? '-- Choisir --' : '-- Choose --'}</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Book-specific basic fields */}
                  {cfg.showAuthor && (
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Auteur principal' : 'Main Author'}</label>
                      <input type="text" value={formData.author} onChange={e => update({ author: e.target.value })} className={inputCls}
                        placeholder={language === 'fr' ? 'Prénom Nom' : 'First Last'} />
                    </div>
                  )}

                  {cfg.showAuthor && (
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Co-auteur(s)' : 'Co-author(s)'}</label>
                      <input type="text" value={formData.coAuthors} onChange={e => update({ coAuthors: e.target.value })} className={inputCls}
                        placeholder={language === 'fr' ? 'Noms séparés par des virgules' : 'Names separated by commas'} />
                    </div>
                  )}

                  {cfg.showAuthor && (
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Maison d\'édition' : 'Publisher'}</label>
                      <input type="text" value={formData.publisher} onChange={e => update({ publisher: e.target.value })} className={inputCls}
                        placeholder="Eyrolles, Dunod, CLE International..." />
                    </div>
                  )}

                  {cfg.showAuthor && (productKind === 'book' || productKind === 'textbook') && (
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Collection' : 'Collection'}</label>
                      <input type="text" value={formData.collection} onChange={e => update({ collection: e.target.value })} className={inputCls}
                        placeholder="Ex: Noire Bleue, Que sais-je..." />
                    </div>
                  )}

                  {cfg.showAuthor && (
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Traducteur' : 'Translator'}</label>
                      <input type="text" value={formData.translator} onChange={e => update({ translator: e.target.value })} className={inputCls}
                        placeholder={language === 'fr' ? 'Si traduit' : 'If translated'} />
                    </div>
                  )}

                  {/* CD-specific basic */}
                  {productKind === 'cd' && (
                    <>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Artiste / Groupe' : 'Artist / Band'} <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.artist} onChange={e => update({ artist: e.target.value })} className={inputCls}
                          placeholder="Ex: Richard Bona" />
                      </div>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Label / Maison de production' : 'Label / Production'}</label>
                        <input type="text" value={formData.label} onChange={e => update({ label: e.target.value })} className={inputCls}
                          placeholder="Universal, Sony, Label local..." />
                      </div>
                    </>
                  )}

                  {/* DVD-specific basic */}
                  {productKind === 'dvd' && (
                    <>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Réalisateur' : 'Director'}</label>
                        <input type="text" value={formData.director} onChange={e => update({ director: e.target.value })} className={inputCls}
                          placeholder="Prénom Nom" />
                      </div>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Studio / Distributeur' : 'Studio / Distributor'}</label>
                        <input type="text" value={formData.studio} onChange={e => update({ studio: e.target.value })} className={inputCls}
                          placeholder="Canal+, Pathé..." />
                      </div>
                    </>
                  )}

                  {/* Supplies-specific basic */}
                  {(productKind === 'supplies' || productKind === 'calculator' || productKind === 'other') && (
                    <>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Marque' : 'Brand'}</label>
                        <input type="text" value={formData.brand} onChange={e => update({ brand: e.target.value })} className={inputCls}
                          placeholder={productKind === 'calculator' ? 'Casio, Texas Instruments, HP' : 'Maped, BIC, Staedtler...'} />
                      </div>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Modèle / Référence' : 'Model / Reference'}</label>
                        <input type="text" value={formData.model} onChange={e => update({ model: e.target.value })} className={inputCls}
                          placeholder={productKind === 'calculator' ? 'FX-991EX, TI-84 Plus...' : 'Référence fabricant'} />
                      </div>
                    </>
                  )}

                  {/* Cover image */}
                  <div className="md:col-span-2">
                    <label className={labelCls}>{language === 'fr' ? 'Image / Couverture' : 'Cover Image'}</label>
                    <div className="flex gap-4 items-start">
                      {/* Preview */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 flex-shrink-0 rounded-xl border-2 border-dashed border-border hover:border-orange-600 transition-colors cursor-pointer bg-muted/30 flex flex-col items-center justify-center overflow-hidden"
                      >
                        {coverImagePreview ? (
                          <img src={coverImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground text-center leading-tight px-1">
                              {language === 'fr' ? 'Depuis\nl\'appareil' : 'From\ndevice'}
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-4 py-2.5 border border-border rounded-lg hover:border-orange-600 hover:text-orange-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {language === 'fr' ? 'Choisir une photo depuis l\'appareil' : 'Choose a photo from device'}
                        </button>
                        <div className="relative">
                          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
                            <span className="flex-1 border-t border-border" />
                            <span className="mx-3 text-xs text-muted-foreground">{language === 'fr' ? 'ou coller une URL' : 'or paste URL'}</span>
                            <span className="flex-1 border-t border-border" />
                          </span>
                          <div className="h-6" />
                        </div>
                        <input
                          type="url"
                          value={formData.coverImageUrl.startsWith('data:') ? '' : formData.coverImageUrl}
                          onChange={e => handleCoverImageUrl(e.target.value)}
                          className={inputCls}
                          placeholder="https://..."
                        />
                        {coverImagePreview && (
                          <button
                            type="button"
                            onClick={() => { update({ coverImageUrl: '' }); setCoverImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            {language === 'fr' ? 'Supprimer l\'image' : 'Remove image'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Prix & Stock ── */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                {sectionTitle('Prix et disponibilité', 'Pricing & Availability')}

                {/* Sale type */}
                <div>
                  <label className={labelCls}>{language === 'fr' ? 'Mode de vente' : 'Sale Mode'} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { val: 'sale', fr: 'Vente', en: 'For Sale', icon: Tag },
                      { val: 'rental', fr: 'Location', en: 'Rental', icon: Repeat, hide: productKind === 'calculator' || productKind === 'supplies' || productKind === 'cd' || productKind === 'dvd' },
                      { val: 'both', fr: 'Vente + Location', en: 'Sale + Rental', icon: Layers, hide: productKind === 'calculator' || productKind === 'supplies' || productKind === 'cd' || productKind === 'dvd' },
                      { val: 'digital_only', fr: 'PDF uniquement', en: 'Digital only', icon: FileText, hide: !cfg.showDigital },
                    ].filter(o => !o.hide).map(opt => {
                      const Icon = opt.icon;
                      const active = formData.saleType === opt.val;
                      return (
                        <button key={opt.val} type="button"
                          onClick={() => update({ saleType: opt.val as SaleType })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${active ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/20 text-orange-600' : 'border-border hover:border-orange-300'}`}>
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{language === 'fr' ? opt.fr : opt.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {(formData.saleType === 'sale' || formData.saleType === 'both') && (
                    <>
                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Prix de vente (FCFA)' : 'Sale Price (XAF)'} <span className="text-red-500">*</span>
                      </label>
                      <input type="number" value={formData.salePrice} onChange={e => update({ salePrice: Number(e.target.value) })}
                        className={inputCls} min="0" step="100" placeholder="5000" />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Prix d’achat (FCFA)' : 'Purchase Price (XAF)'}
                      </label>
                      <input type="number" value={formData.purchasePrice} onChange={e => update({ purchasePrice: Number(e.target.value) })}
                        className={inputCls} min="0" step="100" placeholder="3500" />
                      {formData.salePrice > 0 && formData.purchasePrice > 0 && (
                        <p className="text-xs text-emerald-600 mt-1">
                          {language === 'fr'
                            ? `Bénéfice unitaire estimé : ${formData.salePrice - formData.purchasePrice} FCFA`
                            : `Estimated unit profit: ${formData.salePrice - formData.purchasePrice} XAF`}
                        </p>
                      )}
                    </div>
                    </>
                  )}

                  {(formData.saleType === 'rental' || formData.saleType === 'both') && (
                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Prix de location / jour (FCFA)' : 'Rental price / day (XAF)'} <span className="text-red-500">*</span>
                      </label>
                      <input type="number" value={formData.rentalPricePerDay} onChange={e => update({ rentalPricePerDay: Number(e.target.value) })}
                        className={inputCls} min="0" step="50" placeholder="200" />
                    </div>
                  )}

                  {formData.saleType === 'rental' && (
                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Prix d’achat (FCFA)' : 'Purchase Price (XAF)'}
                      </label>
                      <input type="number" value={formData.purchasePrice} onChange={e => update({ purchasePrice: Number(e.target.value) })}
                        className={inputCls} min="0" step="100" placeholder="3500" />
                    </div>
                  )}

                  {(isDigitalOnly || formData.hasDigitalVersion) && (
                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Prix version PDF (FCFA)' : 'PDF Price (XAF)'} <span className="text-red-500">*</span>
                      </label>
                      <input type="number" value={formData.digitalPrice} onChange={e => update({ digitalPrice: Number(e.target.value) })}
                        className={inputCls} min="0" step="100" placeholder="2500" />
                    </div>
                  )}

                  {isDigitalOnly && (
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {language === 'fr'
                            ? 'Mode PDF uniquement : aucun stock physique requis. Le fichier sera téléchargeable après achat.'
                            : 'Digital only mode: no physical stock needed. The file will be downloadable after purchase.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!isDigitalOnly && (
                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Quantité en stock' : 'Stock Quantity'} <span className="text-red-500">*</span>
                      </label>
                      <input type="number" value={formData.stock} onChange={e => update({ stock: Number(e.target.value) })}
                        className={inputCls} min="0" />
                    </div>
                  )}

                  {!isDigitalOnly && (
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Seuil d\'alerte stock' : 'Low Stock Alert'}</label>
                      <input type="number" value={formData.minStockAlert} onChange={e => update({ minStockAlert: Number(e.target.value) })}
                        className={inputCls} min="0" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'fr' ? 'Alerte quand stock ≤ ce seuil' : 'Alert when stock ≤ this threshold'}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>{language === 'fr' ? 'Disponibilité' : 'Availability'}</label>
                    <select value={formData.availability} onChange={e => update({ availability: e.target.value as any })} className={inputCls}>
                      <option value="available">{language === 'fr' ? 'Disponible' : 'Available'}</option>
                      <option value="out_of_stock">{language === 'fr' ? 'Rupture de stock' : 'Out of Stock'}</option>
                      <option value="pre_order">{language === 'fr' ? 'Pré-commande' : 'Pre-order'}</option>
                      <option value="coming_soon">{language === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Description ── */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                {sectionTitle('Description', 'Description')}

                <div>
                  <label className={labelCls}>
                    {language === 'fr' ? 'Résumé court (accroche)' : 'Short Summary (Hook)'}
                  </label>
                  <textarea value={formData.shortSummary} onChange={e => update({ shortSummary: e.target.value })}
                    className={`${inputCls} h-24 resize-none`}
                    placeholder={
                      productKind === 'book' || productKind === 'textbook'
                        ? (language === 'fr' ? 'Ce que le lecteur va apprendre ou découvrir en 2-3 phrases...' : 'What the reader will learn in 2-3 sentences...')
                        : productKind === 'cd' || productKind === 'dvd'
                        ? (language === 'fr' ? 'Brève description du contenu, ambiance, points forts...' : 'Brief content description, mood, highlights...')
                        : (language === 'fr' ? 'Description courte du produit...' : 'Short product description...')
                    } />
                  <p className="text-xs text-muted-foreground mt-1">{formData.shortSummary.length}/300</p>
                </div>

                <div>
                  <label className={labelCls}>
                    {language === 'fr' ? 'Description complète' : 'Full Description'}
                  </label>
                  <textarea value={formData.detailedDescription} onChange={e => update({ detailedDescription: e.target.value })}
                    className={`${inputCls} h-48 resize-y`}
                    placeholder={language === 'fr' ? 'Description détaillée du produit...' : 'Detailed product description...'} />
                </div>

                {(productKind === 'book' || productKind === 'textbook') && (
                  <>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Public cible' : 'Target Audience'}</label>
                      <input type="text" value={formData.targetAudience} onChange={e => update({ targetAudience: e.target.value })}
                        className={inputCls}
                        placeholder={language === 'fr' ? 'Ex: Terminale, Licence 1, Professionnels RH...' : 'Ex: Grade 12, First year students, HR professionals...'} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Sommaire / Table des matières' : 'Table of Contents'}</label>
                      <textarea value={formData.tableOfContents} onChange={e => update({ tableOfContents: e.target.value })}
                        className={`${inputCls} h-32 resize-y`}
                        placeholder={language === 'fr' ? 'Chapitre 1: ...\nChapitre 2: ...' : 'Chapter 1: ...\nChapter 2: ...'} />
                    </div>
                  </>
                )}

                {productKind === 'cd' && (
                  <div>
                    <label className={labelCls}>{language === 'fr' ? 'Liste des titres (tracklist)' : 'Track List'}</label>
                    <textarea value={formData.tableOfContents} onChange={e => update({ tableOfContents: e.target.value })}
                      className={`${inputCls} h-32 resize-y`}
                      placeholder={language === 'fr' ? '1. Titre A - 3:24\n2. Titre B - 4:10\n...' : '1. Track A - 3:24\n2. Track B - 4:10\n...'} />
                  </div>
                )}

                <div>
                  <label className={labelCls}>{language === 'fr' ? 'Mots-clés (SEO)' : 'Keywords (SEO)'}</label>
                  <input type="text" value={formData.keywords} onChange={e => update({ keywords: e.target.value })}
                    className={inputCls}
                    placeholder={language === 'fr' ? 'programmation, python, débutant... (séparés par des virgules)' : 'programming, python, beginner... (comma separated)'} />
                </div>
              </div>
            )}

            {/* ── TAB: Caractéristiques techniques ── */}
            {activeTab === 'technical' && (
              <div className="space-y-6">
                {sectionTitle('Caractéristiques techniques', 'Technical Specifications')}

                {/* BOOK / TEXTBOOK / DOCUMENT */}
                {(productKind === 'book' || productKind === 'textbook' || productKind === 'document') && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {cfg.showISBN && (
                      <div>
                        <label className={labelCls}>ISBN</label>
                        <input type="text" value={formData.isbn} onChange={e => update({ isbn: e.target.value })}
                          className={inputCls} placeholder="978-2-212-16821-4" maxLength={20} />
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'fr' ? '13 chiffres, imprimé au dos du livre' : '13 digits, printed on back cover'}
                        </p>
                      </div>
                    )}
                    {cfg.showISBN && (
                      <div>
                        <label className={labelCls}>EAN / Code-barres</label>
                        <input type="text" value={formData.ean} onChange={e => update({ ean: e.target.value })}
                          className={inputCls} placeholder="9782212168214" />
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Nombre de pages' : 'Page Count'}</label>
                      <input type="number" value={formData.pageCount || ''} onChange={e => update({ pageCount: Number(e.target.value) })}
                        className={inputCls} min="1" placeholder="256" />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Format / Dimensions' : 'Format / Dimensions'}</label>
                      <input type="text" value={formData.dimensions} onChange={e => update({ dimensions: e.target.value })}
                        className={inputCls} placeholder="15 x 21 cm, A4, A5..." />
                    </div>
                    {(productKind === 'book' || productKind === 'textbook') && (
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Type de reliure' : 'Binding Type'}</label>
                        <select value={formData.coverType} onChange={e => update({ coverType: e.target.value as any })} className={inputCls}>
                          <option value="paperback">{language === 'fr' ? 'Broché' : 'Paperback'}</option>
                          <option value="hardcover">{language === 'fr' ? 'Relié (cartonné)' : 'Hardcover'}</option>
                          <option value="spiral">{language === 'fr' ? 'À spirales' : 'Spiral-bound'}</option>
                          <option value="ebook">{language === 'fr' ? 'Numérique (ebook)' : 'Digital (ebook)'}</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Intérieur' : 'Interior'}</label>
                      <select value={formData.interiorColor} onChange={e => update({ interiorColor: e.target.value as any })} className={inputCls}>
                        <option value="bw">{language === 'fr' ? 'Noir & Blanc' : 'Black & White'}</option>
                        <option value="color">{language === 'fr' ? 'Couleur' : 'Color'}</option>
                        <option value="mixed">{language === 'fr' ? 'Mixte (N&B + couleur)' : 'Mixed (B&W + color)'}</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Date de parution' : 'Publication Date'}</label>
                      <input type="date" value={formData.publicationDate} onChange={e => update({ publicationDate: e.target.value })} className={inputCls} />
                    </div>
                    {cfg.showISBN && (
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Numéro d\'édition' : 'Edition'}</label>
                        <select value={formData.edition} onChange={e => update({ edition: e.target.value })} className={inputCls}>
                          {['1','2','3','4','5','6','7','8','9','10'].map(n => (
                            <option key={n} value={n}>{n}e {language === 'fr' ? 'édition' : 'edition'}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Langue du contenu' : 'Content Language'}</label>
                      <select value={formData.bookLanguage} onChange={e => update({ bookLanguage: e.target.value })} className={inputCls}>
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="ar">Arabe</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                        <option value="other">{language === 'fr' ? 'Autre' : 'Other'}</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Poids (g)' : 'Weight (g)'}</label>
                      <input type="number" value={formData.weight || ''} onChange={e => update({ weight: Number(e.target.value) })}
                        className={inputCls} min="0" placeholder="350" />
                    </div>
                  </div>
                )}

                {/* CD */}
                {productKind === 'cd' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Genre musical' : 'Music Genre'}</label>
                      <select value={formData.genre} onChange={e => update({ genre: e.target.value })} className={inputCls}>
                        <option value="">{language === 'fr' ? '-- Choisir --' : '-- Choose --'}</option>
                        {MUSIC_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Durée totale' : 'Total Duration'}</label>
                      <input type="text" value={formData.cdDuration} onChange={e => update({ cdDuration: e.target.value })}
                        className={inputCls} placeholder="1h 12min" />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Nombre de titres' : 'Track Count'}</label>
                      <input type="number" value={formData.trackCount || ''} onChange={e => update({ trackCount: Number(e.target.value) })}
                        className={inputCls} min="1" />
                    </div>
                    <div>
                      <label className={labelCls}>EAN / Code-barres</label>
                      <input type="text" value={formData.ean} onChange={e => update({ ean: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Année de sortie' : 'Release Year'}</label>
                      <input type="text" value={formData.publicationDate} onChange={e => update({ publicationDate: e.target.value })}
                        className={inputCls} placeholder="2024" maxLength={4} />
                    </div>
                  </div>
                )}

                {/* DVD */}
                {productKind === 'dvd' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Genre' : 'Genre'}</label>
                      <select value={formData.genre} onChange={e => update({ genre: e.target.value })} className={inputCls}>
                        <option value="">{language === 'fr' ? '-- Choisir --' : '-- Choose --'}</option>
                        {FILM_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Durée (minutes)' : 'Duration (minutes)'}</label>
                      <input type="number" value={formData.durationMinutes || ''} onChange={e => update({ durationMinutes: Number(e.target.value) })}
                        className={inputCls} min="1" placeholder="95" />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Langue originale (VO)' : 'Original Language'}</label>
                      <input type="text" value={formData.originalLanguage} onChange={e => update({ originalLanguage: e.target.value })}
                        className={inputCls} placeholder="Français, Anglais..." />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Sous-titres disponibles' : 'Available Subtitles'}</label>
                      <input type="text" value={formData.subtitles} onChange={e => update({ subtitles: e.target.value })}
                        className={inputCls} placeholder="FR, EN, AR..." />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Classification / Âge' : 'Age Rating'}</label>
                      <select value={formData.pegiRating} onChange={e => update({ pegiRating: e.target.value as any })} className={inputCls}>
                        <option value="">--</option>
                        <option value="TP">{language === 'fr' ? 'Tous publics (TP)' : 'All ages (G)'}</option>
                        <option value="10">10+</option>
                        <option value="12">12+</option>
                        <option value="16">16+</option>
                        <option value="18">18+</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Année de sortie' : 'Release Year'}</label>
                      <input type="text" value={formData.publicationDate} onChange={e => update({ publicationDate: e.target.value })}
                        className={inputCls} placeholder="2023" maxLength={4} />
                    </div>
                    <div>
                      <label className={labelCls}>EAN / Code-barres</label>
                      <input type="text" value={formData.ean} onChange={e => update({ ean: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                )}

                {/* SUPPLIES */}
                {productKind === 'supplies' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Référence fabricant' : 'Manufacturer Reference'}</label>
                      <input type="text" value={formData.reference} onChange={e => update({ reference: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Couleur(s)' : 'Color(s)'}</label>
                      <input type="text" value={formData.color} onChange={e => update({ color: e.target.value })}
                        className={inputCls} placeholder={language === 'fr' ? 'Rouge, bleu, assorti...' : 'Red, blue, assorted...'} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Matière' : 'Material'}</label>
                      <input type="text" value={formData.material} onChange={e => update({ material: e.target.value })}
                        className={inputCls} placeholder={language === 'fr' ? 'Plastique, métal, bois...' : 'Plastic, metal, wood...'} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Dimensions' : 'Dimensions'}</label>
                      <input type="text" value={formData.dimensions2} onChange={e => update({ dimensions2: e.target.value })}
                        className={inputCls} placeholder="30 x 4 x 1 cm" />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Poids (g)' : 'Weight (g)'}</label>
                      <input type="number" value={formData.weight2 || ''} onChange={e => update({ weight2: Number(e.target.value) })}
                        className={inputCls} min="0" />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Garantie' : 'Warranty'}</label>
                      <input type="text" value={formData.warranty} onChange={e => update({ warranty: e.target.value })}
                        className={inputCls} placeholder={language === 'fr' ? '6 mois, 1 an...' : '6 months, 1 year...'} />
                    </div>
                  </div>
                )}

                {/* CALCULATOR */}
                {productKind === 'calculator' && (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Référence / Numéro de modèle' : 'Reference / Model Number'}</label>
                        <input type="text" value={formData.reference} onChange={e => update({ reference: e.target.value })}
                          className={inputCls} placeholder="FX-991EX" />
                      </div>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Type de pile' : 'Battery Type'}</label>
                        <input type="text" value={formData.batteryType} onChange={e => update({ batteryType: e.target.value })}
                          className={inputCls} placeholder="AAA, LR03, CR2032..." />
                      </div>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Nombre de lignes d\'affichage' : 'Display Lines'}</label>
                        <input type="number" value={formData.displayLines || ''} onChange={e => update({ displayLines: Number(e.target.value) })}
                          className={inputCls} min="1" max="10" placeholder="2" />
                      </div>
                      <div>
                        <label className={labelCls}>{language === 'fr' ? 'Couleur' : 'Color'}</label>
                        <input type="text" value={formData.color} onChange={e => update({ color: e.target.value })}
                          className={inputCls} placeholder={language === 'fr' ? 'Noir, blanc...' : 'Black, white...'} />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.isGraphing} onChange={e => update({ isGraphing: e.target.checked })} className="w-4 h-4" />
                        <span className="text-sm font-medium">{language === 'fr' ? 'Calculatrice graphique' : 'Graphing calculator'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.isSolar} onChange={e => update({ isSolar: e.target.checked })} className="w-4 h-4" />
                        <span className="text-sm font-medium">{language === 'fr' ? 'Alimentation solaire' : 'Solar powered'}</span>
                      </label>
                    </div>

                    <div>
                      <label className={labelCls}>
                        {language === 'fr' ? 'Examens pour lesquels elle est autorisée' : 'Exams where allowed'}
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ALLOWED_EXAMS.map(exam => (
                          <button key={exam} type="button"
                            onClick={() => toggleExam(exam)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                              formData.allowedExams.includes(exam)
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'border-border hover:border-orange-400'
                            }`}>
                            {exam}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* OTHER */}
                {productKind === 'other' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Référence' : 'Reference'}</label>
                      <input type="text" value={formData.reference} onChange={e => update({ reference: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Dimensions' : 'Dimensions'}</label>
                      <input type="text" value={formData.dimensions2} onChange={e => update({ dimensions2: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Poids (g)' : 'Weight (g)'}</label>
                      <input type="number" value={formData.weight2 || ''} onChange={e => update({ weight2: Number(e.target.value) })} className={inputCls} min="0" />
                    </div>
                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Couleur' : 'Color'}</label>
                      <input type="text" value={formData.color} onChange={e => update({ color: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Auteur & Éditeur (book/textbook/document only) ── */}
            {activeTab === 'author' && cfg.showAuthor && (
              <div className="space-y-6">
                {sectionTitle('Auteur & Éditeur', 'Author & Publisher')}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{language === 'fr' ? 'Niveau requis' : 'Required Level'}</label>
                    <select value={formData.level} onChange={e => update({ level: e.target.value as any })} className={inputCls}>
                      <option value="">{language === 'fr' ? '-- Non spécifié --' : '-- Not specified --'}</option>
                      <option value="beginner">{language === 'fr' ? 'Débutant' : 'Beginner'}</option>
                      <option value="intermediate">{language === 'fr' ? 'Intermédiaire' : 'Intermediate'}</option>
                      <option value="advanced">{language === 'fr' ? 'Avancé / Expert' : 'Advanced / Expert'}</option>
                      <option value="school">{language === 'fr' ? 'Niveau scolaire (primaire/secondaire)' : 'School level (primary/secondary)'}</option>
                      <option value="university">{language === 'fr' ? 'Niveau universitaire' : 'University level'}</option>
                      <option value="professional">{language === 'fr' ? 'Professionnel' : 'Professional'}</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>{language === 'fr' ? 'Domaine / Discipline' : 'Domain / Field'}</label>
                    <input type="text" value={formData.domain} onChange={e => update({ domain: e.target.value })}
                      className={inputCls}
                      placeholder={language === 'fr' ? 'Informatique, Droit, Médecine...' : 'Computer Science, Law, Medicine...'} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{language === 'fr' ? 'Biographie courte de l\'auteur' : 'Author Short Bio'}</label>
                  <textarea value={formData.authorBio} onChange={e => update({ authorBio: e.target.value })}
                    className={`${inputCls} h-36 resize-y`}
                    placeholder={language === 'fr'
                      ? 'Présentation de l\'auteur : formation, expérience, autres ouvrages...'
                      : 'Author presentation: background, experience, other works...'} />
                </div>
              </div>
            )}

            {/* ── TAB: Version PDF ── */}
            {activeTab === 'digital' && cfg.showDigital && (
              <div className="space-y-6">
                {sectionTitle('Version numérique PDF', 'PDF Digital Version')}

                <label className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={formData.hasDigitalVersion}
                    onChange={e => update({ hasDigitalVersion: e.target.checked })} className="w-5 h-5 accent-orange-600" />
                  <div>
                    <p className="font-medium">
                      {language === 'fr' ? 'Ce produit a une version numérique PDF' : 'This product has a PDF digital version'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr' ? 'Les clients pourront acheter et télécharger le PDF' : 'Clients will be able to purchase and download the PDF'}
                    </p>
                  </div>
                </label>

                {formData.hasDigitalVersion && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>{language === 'fr' ? 'Fichier PDF' : 'PDF File'}</label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-orange-600 transition-colors cursor-pointer bg-muted/30">
                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          {language === 'fr' ? 'Cliquez ou glissez le PDF ici' : 'Click or drag PDF here'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {language === 'fr' ? 'Format PDF uniquement · Taille max : 100 MB' : 'PDF only · Max size: 100 MB'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Prix PDF (FCFA)' : 'PDF Price (XAF)'}</label>
                      <input type="number" value={formData.digitalPrice} onChange={e => update({ digitalPrice: Number(e.target.value) })}
                        className={inputCls} min="0" step="100" placeholder="2500" />
                      {formData.salePrice > 0 && formData.digitalPrice > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'fr'
                            ? `Réduction PDF: ${Math.round((1 - formData.digitalPrice / formData.salePrice) * 100)}% par rapport à la version physique`
                            : `PDF discount: ${Math.round((1 - formData.digitalPrice / formData.salePrice) * 100)}% vs physical`}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Nombre de pages (PDF)' : 'PDF Page Count'}</label>
                      <input type="number" value={formData.digitalPageCount || ''} onChange={e => update({ digitalPageCount: Number(e.target.value) })}
                        className={inputCls} min="0" />
                    </div>

                    <div>
                      <label className={labelCls}>{language === 'fr' ? 'Accès' : 'Access'}</label>
                      <select value={formData.digitalAccess} onChange={e => update({ digitalAccess: e.target.value as any })} className={inputCls}>
                        <option value="lifetime">{language === 'fr' ? 'À vie (accès permanent)' : 'Lifetime access'}</option>
                        <option value="limited">{language === 'fr' ? 'Limité (avec expiration)' : 'Limited (expires)'}</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Stock ── */}
            {activeTab === 'stock' && (
              <div className="space-y-6">
                {sectionTitle('Gestion du stock', 'Stock Management')}

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{formData.stock}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{language === 'fr' ? 'Stock actuel' : 'Current stock'}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{formData.minStockAlert}</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{language === 'fr' ? 'Seuil alerte' : 'Alert threshold'}</p>
                  </div>
                  <div className={`rounded-xl p-4 text-center border ${
                    formData.stock === 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200' :
                    formData.stock <= formData.minStockAlert ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' :
                    'bg-green-50 dark:bg-green-900/20 border-green-200'
                  }`}>
                    <p className={`text-sm font-medium mt-2 ${
                      formData.stock === 0 ? 'text-red-600' :
                      formData.stock <= formData.minStockAlert ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {formData.stock === 0
                        ? (language === 'fr' ? '⚠ Rupture' : '⚠ Out of stock')
                        : formData.stock <= formData.minStockAlert
                        ? (language === 'fr' ? '⚠ Stock faible' : '⚠ Low stock')
                        : (language === 'fr' ? '✓ Normal' : '✓ Normal')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{language === 'fr' ? 'Statut' : 'Status'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{language === 'fr' ? 'Stock initial / Quantité' : 'Initial Stock / Quantity'}</label>
                    <input type="number" value={formData.stock} onChange={e => update({ stock: Number(e.target.value) })}
                      className={inputCls} min="0" />
                  </div>
                  <div>
                    <label className={labelCls}>{language === 'fr' ? 'Seuil d\'alerte bas' : 'Low stock alert threshold'}</label>
                    <input type="number" value={formData.minStockAlert} onChange={e => update({ minStockAlert: Number(e.target.value) })}
                      className={inputCls} min="0" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'fr' ? 'Vous serez alerté quand le stock atteint ce nombre' : 'You\'ll be alerted when stock reaches this number'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground">
                    💡 {language === 'fr'
                      ? 'Le stock sera mis à jour automatiquement à chaque commande ou retour de location.'
                      : 'Stock will be updated automatically with each order or rental return.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 bg-card rounded-xl border border-border p-4">
            <button type="button" onClick={() => navigate('/librairie/products')}
              className="px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm">
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>

            <div className="flex items-center gap-2">
              {/* Navigation between tabs */}
              {visibleTabs.findIndex(t => t.id === activeTab) > 0 && (
                <button type="button"
                  onClick={() => {
                    const idx = visibleTabs.findIndex(t => t.id === activeTab);
                    if (idx > 0) setActiveTab(visibleTabs[idx - 1].id);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm">
                  {language === 'fr' ? '← Précédent' : '← Back'}
                </button>
              )}
              {visibleTabs.findIndex(t => t.id === activeTab) < visibleTabs.length - 1 && (
                <button type="button"
                  onClick={() => {
                    const idx = visibleTabs.findIndex(t => t.id === activeTab);
                    if (idx < visibleTabs.length - 1) setActiveTab(visibleTabs[idx + 1].id);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors font-medium text-sm flex items-center gap-1">
                  {language === 'fr' ? 'Suivant' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button type="submit"
                className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm">
                <Save className="w-4 h-4" />
                {isEdit
                  ? (language === 'fr' ? 'Enregistrer les modifications' : 'Save Changes')
                  : (language === 'fr' ? 'Ajouter le produit' : 'Add Product')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
