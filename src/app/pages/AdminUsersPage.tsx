import { useMemo, useState } from 'react';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Filter, Shield, Store, UserCheck, UserX, Mail, Phone, MapPin, Eye } from 'lucide-react';
import { toast } from 'sonner';

type UserFilter = 'all' | 'client' | 'librairie' | 'admin';

export function AdminUsersPage() {
  const { users, toggleUserStatus } = useAdminPlatform();
  const { registeredUsers } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<UserFilter>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const allUsers = useMemo(() => {
    const registered = registeredUsers
      .filter((user) => user.type)
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type as 'client' | 'librairie' | 'admin',
        role: user.type as 'client' | 'librairie' | 'admin',
        phone: '',
        location: user.location,
        city: user.location || 'Non renseignée',
        country: 'Cameroun',
        active: true,
        createdAt: new Date().toISOString(),
      }));
    const byEmail = new Map(users.map((user) => [user.email.toLowerCase(), user]));
    registered.forEach((user) => {
      if (!byEmail.has(user.email.toLowerCase())) byEmail.set(user.email.toLowerCase(), user);
    });
    return Array.from(byEmail.values());
  }, [users, registeredUsers]);

  const filteredUsers = allUsers.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone || '').toLowerCase().includes(query) ||
      (user.location || '').toLowerCase().includes(query);
    const matchesRole = filter === 'all' || user.type === filter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = allUsers.length;
  const clientUsers = allUsers.filter(u => u.type === 'client').length;
  const librairieUsers = allUsers.filter(u => u.type === 'librairie').length;
  const activeUsers = allUsers.filter(u => u.active !== false).length;
  const selectedUser = allUsers.find((user) => user.id === selectedUserId);

  const handleToggle = (userId: string, type: string) => {
    if (type === 'admin') {
      toast.error('Le compte administrateur principal ne peut pas être désactivé.');
      return;
    }
    toggleUserStatus(userId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
              <p className="text-sm text-muted-foreground">Voir tous les utilisateurs de la plateforme et activer/désactiver les comptes clients.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Total</p><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalUsers}</p></div><div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div></div></div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Clients</p><p className="text-2xl font-bold text-green-600 dark:text-green-400">{clientUsers}</p></div><div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"><UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" /></div></div></div>
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Librairies</p><p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{librairieUsers}</p></div><div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center"><Store className="w-6 h-6 text-orange-600 dark:text-orange-400" /></div></div></div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Actifs</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{activeUsers}</p></div><div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center"><Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div></div></div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6 animate-slide-in-left">
          <div className="flex items-center gap-2 mb-4"><Filter className="w-5 h-5 text-muted-foreground" /><h3 className="font-semibold">Filtres</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nom, email, téléphone, ville..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type de compte</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'client', 'librairie', 'admin'] as const).map((role) => (
                  <button key={role} onClick={() => setFilter(role)} className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === role ? 'bg-purple-500 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                    {role === 'all' ? 'Tous' : role === 'client' ? 'Clients' : role === 'librairie' ? 'Librairies' : 'Admins'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-border"><h3 className="text-lg font-semibold">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}</h3></div>
          <div className="divide-y divide-border">
            {filteredUsers.map((user, index) => (
              <div key={user.id} className="p-6 hover:bg-muted/30 transition-colors" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/20 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">{user.name.charAt(0)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-bold text-lg break-words">{user.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.type === 'client' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : user.type === 'librairie' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>{user.type === 'client' ? 'Client' : user.type === 'librairie' ? 'Librairie' : 'Admin'}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{user.active !== false ? 'Actif' : 'Désactivé'}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" /><span className="break-all">{user.email}</span></div>
                        {user.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-4 h-4" /><span>{user.phone}</span></div>}
                        {(user.location || user.city) && <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /><span>{user.location || `${user.city}, ${user.country}`}</span></div>}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setSelectedUserId(user.id)} className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors" title="Voir le profil"><Eye className="w-5 h-5" /></button>
                    <button onClick={() => handleToggle(user.id, user.type)} disabled={user.type === 'admin'} className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${user.active !== false ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'}`}>{user.active !== false ? 'Actif' : 'Désactivé'}</button>
                    {user.type === 'client' && <button onClick={() => handleToggle(user.id, user.type)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Désactiver/réactiver"><UserX className="w-5 h-5" /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredUsers.length === 0 && <div className="text-center py-12"><Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Aucun utilisateur trouvé</p></div>}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedUserId(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">{selectedUser.name.charAt(0)}</div>
              <div>
                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                <p className="text-muted-foreground">{selectedUser.type === 'client' ? 'Client' : selectedUser.type === 'librairie' ? 'Compte librairie' : 'Administrateur'}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Email :</strong> {selectedUser.email}</p>
              <p><strong>Téléphone :</strong> {selectedUser.phone || 'Non renseigné'}</p>
              <p><strong>Localisation :</strong> {selectedUser.location || `${selectedUser.city}, ${selectedUser.country}`}</p>
              <p><strong>Statut :</strong> {selectedUser.active !== false ? 'Actif' : 'Désactivé'}</p>
              <p><strong>Date de création :</strong> {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
            <button onClick={() => setSelectedUserId(null)} className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
