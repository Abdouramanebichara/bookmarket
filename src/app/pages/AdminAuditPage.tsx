import { useState } from 'react';
import { Lock, Search, Filter, User, FileEdit, Trash2, Settings, Shield } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'client' | 'librairie' | 'admin';
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'admin-1',
    userName: 'Admin Principal',
    userRole: 'admin',
    action: 'update',
    resource: 'library',
    resourceId: 'lib-1',
    details: 'Modification du statut de la librairie "Le Livre d\'Or"',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-2',
    userId: 'lib-2',
    userName: 'Librairie Espoir',
    userRole: 'librairie',
    action: 'create',
    resource: 'product',
    resourceId: 'prod-234',
    details: 'Ajout d\'un nouveau produit "Histoire du Cameroun"',
    ipAddress: '192.168.1.102',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-3',
    userId: 'client-45',
    userName: 'Marie Ngo Biyong',
    userRole: 'client',
    action: 'login',
    resource: 'auth',
    details: 'Connexion réussie',
    ipAddress: '192.168.1.105',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-4',
    userId: 'admin-1',
    userName: 'Admin Principal',
    userRole: 'admin',
    action: 'delete',
    resource: 'user',
    resourceId: 'user-789',
    details: 'Suppression du compte utilisateur "test@example.com"',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'audit-5',
    userId: 'lib-3',
    userName: 'Librairie Renaissance',
    userRole: 'librairie',
    action: 'update',
    resource: 'inventory',
    resourceId: 'inv-456',
    details: 'Mise à jour du stock pour le produit "Munyal"',
    ipAddress: '192.168.1.108',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function AdminAuditPage() {
  const [logs] = useState(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | AuditLog['action']>('all');

  const filteredLogs = logs.filter(log =>
    (log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (actionFilter === 'all' || log.action === actionFilter)
  );

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'create': return FileEdit;
      case 'update': return Settings;
      case 'delete': return Trash2;
      case 'login': return User;
      case 'logout': return User;
    }
  };

  const getActionColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'create': return 'bg-green-600';
      case 'update': return 'bg-blue-600';
      case 'delete': return 'bg-red-600';
      case 'login': return 'bg-purple-600';
      case 'logout': return 'bg-gray-700';
    }
  };

  const getRoleBadgeColor = (role: AuditLog['userRole']) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'librairie': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'client': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Journal d'Audit</h1>
              <p className="text-sm text-muted-foreground">
                Suivez toutes les actions effectuées sur la plateforme
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{logs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Créations</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {logs.filter(l => l.action === 'create').length}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Modifications</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {logs.filter(l => l.action === 'update').length}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Suppressions</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {logs.filter(l => l.action === 'delete').length}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Connexions</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {logs.filter(l => l.action === 'login').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6 animate-slide-in-left">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtres</h3>
          </div>

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
                  placeholder="Utilisateur, action..."
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Type d'action</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'create', 'update', 'delete', 'login'] as const).map((action) => (
                  <button
                    key={action}
                    onClick={() => setActionFilter(action)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      actionFilter === action
                        ? 'bg-purple-500 text-white'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {action === 'all' ? 'Toutes' : action === 'create' ? 'Créer' : action === 'update' ? 'Modifier' : action === 'delete' ? 'Supprimer' : 'Connexion'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="space-y-3 animate-fade-in">
          {filteredLogs.map((log, index) => {
            const Icon = getActionIcon(log.action);
            const colorClass = getActionColor(log.action);

            return (
              <div
                key={log.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-primary ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">{log.userName}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(log.userRole)}`}>
                          {log.userRole === 'admin' ? 'Admin' : log.userRole === 'librairie' ? 'Librairie' : 'Client'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.action === 'create' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          log.action === 'update' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          log.action === 'delete' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {log.action === 'create' ? 'Création' : log.action === 'update' ? 'Modification' : log.action === 'delete' ? 'Suppression' : log.action === 'login' ? 'Connexion' : 'Déconnexion'}
                        </span>
                      </div>

                      <p className="text-foreground mb-2">{log.details}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {new Date(log.timestamp).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                        {log.resourceId && (
                          <>
                            <span>•</span>
                            <span>ID: {log.resourceId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Aucune entrée</h2>
            <p className="text-muted-foreground">Aucune activité trouvée avec ces filtres</p>
          </div>
        )}
      </div>
    </div>
  );
}
