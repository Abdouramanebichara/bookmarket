import { useMemo, useState } from 'react';
import { Tag, Plus, Edit2, Trash2, FolderOpen, X } from 'lucide-react';
import { useAdminPlatform, ManagedCategory } from '../context/AdminPlatformContext';

type CategoryForm = {
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  genres: string;
  active: boolean;
};

const emptyForm: CategoryForm = {
  nameFr: '',
  nameEn: '',
  descriptionFr: '',
  descriptionEn: '',
  icon: '📚',
  genres: '',
  active: true,
};

function categoryToForm(category: ManagedCategory): CategoryForm {
  const name = category.name;
  const description = category.description;
  return {
    nameFr: typeof name === 'string' ? name : name.fr,
    nameEn: typeof name === 'string' ? name : name.en,
    descriptionFr: !description ? '' : typeof description === 'string' ? description : description.fr,
    descriptionEn: !description ? '' : typeof description === 'string' ? description : description.en,
    icon: category.icon || '📚',
    genres: category.genres.join(', '),
    active: category.active ?? true,
  };
}

export function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useAdminPlatform();
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.active !== false).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productsCount, 0);
  const totalGenres = useMemo(() => categories.reduce((sum, category) => sum + category.genres.length, 0), [categories]);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalMode('add');
  };

  const openEditModal = (category: ManagedCategory) => {
    setForm(categoryToForm(category));
    setEditingId(category.id);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    const payload = {
      name: { fr: form.nameFr.trim(), en: form.nameEn.trim() || form.nameFr.trim() },
      description: { fr: form.descriptionFr.trim(), en: form.descriptionEn.trim() || form.descriptionFr.trim() },
      icon: form.icon || '📚',
      active: form.active,
      genres: form.genres.split(',').map((item) => item.trim()).filter(Boolean),
    };
    if (!payload.name.fr) return;
    if (modalMode === 'add') addCategory(payload);
    if (modalMode === 'edit' && editingId) updateCategory(editingId, payload);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-950/20 rounded-xl flex items-center justify-center"><Tag className="w-6 h-6 text-pink-600" /></div>
              <div>
                <h1 className="text-3xl font-bold">Gestion des Catégories & Genres</h1>
                <p className="text-sm text-muted-foreground">Organisez librement les catégories et les genres associés, sans ordre imposé.</p>
              </div>
            </div>
            <button onClick={openAddModal} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium flex items-center gap-2"><Plus className="w-5 h-5" />Ajouter une catégorie</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Catégories</p><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCategories}</p></div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Actives</p><p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCategories}</p></div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Produits classés</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalProducts}</p></div>
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Genres</p><p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalGenres}</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {categories.map((category, index) => {
            const name = typeof category.name === 'string' ? { fr: category.name, en: category.name } : category.name;
            const description = !category.description ? { fr: '', en: '' } : typeof category.description === 'string' ? { fr: category.description, en: category.description } : category.description;
            return (
              <div key={category.id} className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/20 rounded-lg flex items-center justify-center text-2xl shrink-0">{category.icon}</div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg break-words">{name.fr}</h3>
                        <p className="text-xs text-muted-foreground">{name.en}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{category.active !== false ? 'Active' : 'Inactive'}</span>
                  </div>
                  {description.fr && <p className="text-sm text-muted-foreground mb-4">{description.fr}</p>}
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-2">
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Produits</span><span className="font-bold">{category.productsCount}</span></div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Genres</p>
                    <div className="flex flex-wrap gap-2">
                      {category.genres.length > 0 ? category.genres.map((genre) => <span key={genre} className="px-2 py-1 bg-secondary rounded-full text-xs">{genre}</span>) : <span className="text-xs text-muted-foreground">Aucun genre défini</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleCategoryStatus(category.id)} className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${category.active !== false ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{category.active !== false ? 'Active' : 'Inactive'}</button>
                    <button onClick={() => openEditModal(category)} className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm('Supprimer cette catégorie ?')) deleteCategory(category.id); }} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">{modalMode === 'add' ? 'Ajouter une catégorie' : 'Modifier la catégorie'}</h2><button onClick={closeModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Nom français</label><input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Nom anglais</label><input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Description FR</label><input value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Description EN</label><input value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-2">Icône</label><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Genres séparés par des virgules</label><input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" placeholder="Roman, Essai, Scolaire..." /></div>
            </div>
            <div className="flex items-center gap-3 mt-6"><button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90"><FolderOpen className="w-4 h-4 inline mr-2" />Sauvegarder</button><button onClick={closeModal} className="px-6 py-3 bg-secondary rounded-lg hover:bg-secondary/80">Annuler</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
