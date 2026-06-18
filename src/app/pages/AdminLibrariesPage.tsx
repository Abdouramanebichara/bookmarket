import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { Store, Search, MapPin, Phone, Mail, Globe, Star, CheckCircle, Eye, Power, Package, ExternalLink } from 'lucide-react';

export function AdminLibrariesPage() {
  const navigate = useNavigate();
  const { libraries, products, toggleLibraryStatus, toggleLibraryVerification } = useAdminPlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);

  const filteredLibraries = libraries.filter((lib) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      lib.name.toLowerCase().includes(query) ||
      lib.location.city.toLowerCase().includes(query) ||
      lib.location.address.toLowerCase().includes(query) ||
      (lib.email || '').toLowerCase().includes(query) ||
      (lib.phone || '').toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && lib.active) || (statusFilter === 'inactive' && !lib.active);
    return matchesSearch && matchesStatus;
  });

  const selectedLibrary = libraries.find((library) => library.id === selectedLibraryId);
  const selectedProducts = selectedLibrary ? products.filter((product) => product.librarieId === selectedLibrary.id) : [];
  const totalLibraries = libraries.length;
  const activeLibraries = libraries.filter(l => l.active).length;
  const verifiedLibraries = libraries.filter(l => l.verified).length;
  const avgRating = libraries.length ? libraries.reduce((sum, l) => sum + l.rating, 0) / libraries.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center"><Store className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-3xl font-bold">Gestion des Librairies</h1>
              <p className="text-sm text-muted-foreground">Consulter les profils librairie, vérifier et désactiver les comptes partenaires.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Total</p><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalLibraries}</p></div><div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center"><Store className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div></div></div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Actives</p><p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeLibraries}</p></div><div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" /></div></div></div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Vérifiées</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{verifiedLibraries}</p></div><div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div></div></div>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Note Moyenne</p><p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{avgRating.toFixed(1)}</p></div><div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center"><Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" /></div></div></div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6 animate-slide-in-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rechercher</label>
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nom, ville, téléphone..." /></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'active', 'inactive'] as const).map((status) => <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === status ? 'bg-purple-500 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>{status === 'all' ? 'Toutes' : status === 'active' ? 'Actives' : 'Inactives'}</button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {filteredLibraries.map((library, index) => {
            const libraryProducts = products.filter((product) => product.librarieId === library.id);
            return (
              <div key={library.id} className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                {library.coverImage && <div className="h-32 bg-orange-50 dark:bg-orange-950/20 relative"><img src={library.coverImage} alt={library.name} className="w-full h-full object-cover opacity-50" /></div>}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center flex-shrink-0">{library.logo ? <img src={library.logo} alt={library.name} className="w-full h-full object-cover rounded-xl" /> : <Store className="w-8 h-8 text-white" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap"><h3 className="font-bold text-lg break-words">{library.name}</h3>{library.verified && <CheckCircle className="w-5 h-5 text-green-500 fill-green-500" />}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-medium">{library.rating.toFixed(1)}</span></div><span>•</span><span>{library.reviewsCount} avis</span></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /><span>{library.location.address}, {library.location.city}</span></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-4 h-4" /><span>{library.phone}</span></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" /><span className="break-all">{library.email || 'Email non renseigné'}</span></div>
                    {library.website && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Globe className="w-4 h-4" /><span className="break-all">{library.website}</span></div>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/50 rounded-lg p-3 text-center"><p className="text-lg font-bold">{libraryProducts.length || library.productsCount}</p><p className="text-xs text-muted-foreground">Produits</p></div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center"><p className="text-lg font-bold">{library.active ? 'Active' : 'Inactive'}</p><p className="text-xs text-muted-foreground">Statut</p></div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => toggleLibraryStatus(library.id)} className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${library.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'}`}><Power className="w-4 h-4 inline mr-1" />{library.active ? 'Désactiver' : 'Activer'}</button>
                    <button onClick={() => toggleLibraryVerification(library.id)} className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${library.verified ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>{library.verified ? 'Vérifiée' : 'Vérifier'}</button>
                    <button onClick={() => setSelectedLibraryId(library.id)} className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors" title="Consulter le profil"><Eye className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLibraries.length === 0 && <div className="text-center py-16 animate-fade-in"><Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Aucune librairie trouvée</p></div>}
      </div>

      {selectedLibrary && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedLibraryId(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            {selectedLibrary.coverImage && <img src={selectedLibrary.coverImage} alt={selectedLibrary.name} className="w-full h-48 object-cover rounded-t-2xl" />}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center shrink-0">{selectedLibrary.logo ? <img src={selectedLibrary.logo} alt={selectedLibrary.name} className="w-full h-full object-cover" /> : <Store className="w-10 h-10 text-orange-600" />}</div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold break-words">{selectedLibrary.name}</h2>
                  <p className="text-muted-foreground">{selectedLibrary.description}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
                <p><strong>Adresse :</strong> {selectedLibrary.location.address}, {selectedLibrary.location.city}</p>
                <p><strong>GPS :</strong> {selectedLibrary.location.latitude}, {selectedLibrary.location.longitude}</p>
                <p><strong>Téléphone :</strong> {selectedLibrary.phone}</p>
                <p><strong>Email :</strong> {selectedLibrary.email || 'Non renseigné'}</p>
                <p><strong>Horaires :</strong> {selectedLibrary.openingHours || 'Non renseigné'}</p>
                <p><strong>Statut :</strong> {selectedLibrary.active ? 'Active' : 'Inactive'} / {selectedLibrary.verified ? 'Vérifiée' : 'Non vérifiée'}</p>
                <p><strong>Produits :</strong> {selectedProducts.length}</p>
                <p><strong>Source :</strong> {selectedLibrary.source || 'Données internes'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate(`/libraries/${selectedLibrary.id}`)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2"><Eye className="w-4 h-4" />Fiche publique</button>
                <a href={`https://www.google.com/maps/search/?api=1&query=${selectedLibrary.location.latitude},${selectedLibrary.location.longitude}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 flex items-center gap-2"><ExternalLink className="w-4 h-4" />Google Maps</a>
                <button onClick={() => toggleLibraryStatus(selectedLibrary.id)} className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200"><Power className="w-4 h-4 inline mr-1" />{selectedLibrary.active ? 'Désactiver librairie' : 'Activer librairie'}</button>
                <button onClick={() => setSelectedLibraryId(null)} className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80">Fermer</button>
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Package className="w-5 h-5" />Produits de la librairie</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {selectedProducts.slice(0, 8).map((product) => <div key={product.id} className="p-3 rounded-lg bg-muted/50 text-sm flex justify-between gap-3"><span className="font-medium line-clamp-1">{product.title}</span><span>{product.available === false ? 'Retiré' : 'Visible'}</span></div>)}
                  {selectedProducts.length === 0 && <p className="text-muted-foreground text-sm">Aucun produit associé.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
