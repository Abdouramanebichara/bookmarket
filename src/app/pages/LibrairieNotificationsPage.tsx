import { useState } from 'react';
import { Bell, ShoppingBag, Package, Star, AlertCircle, CheckCircle, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'order' | 'rental' | 'review' | 'stock' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export function LibrairieNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'order',
      title: 'Nouvelle commande reçue',
      message: 'Marie Ngo Biyong a passé une commande de 27 000 XAF',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/librairie/orders',
    },
    {
      id: 'notif-2',
      type: 'stock',
      title: 'Stock faible',
      message: 'Le produit "Munyal : Les Larmes de la Patience" a un stock inférieur à 5 unités',
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/librairie/inventory',
    },
    {
      id: 'notif-3',
      type: 'review',
      title: 'Nouvel avis client',
      message: 'Jean Kouam a laissé un avis 5 étoiles sur "Le Vieux Nègre et la Médaille"',
      read: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/librairie/reviews',
    },
    {
      id: 'notif-4',
      type: 'rental',
      title: 'Location en retard',
      message: 'Une location arrive à échéance aujourd\'hui. Client: Sophie Mballa',
      read: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/librairie/rentals',
    },
    {
      id: 'notif-5',
      type: 'order',
      title: 'Commande confirmée',
      message: 'La commande #12345 a été confirmée et est prête pour l\'expédition',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/librairie/orders',
    },
    {
      id: 'notif-6',
      type: 'system',
      title: 'Mise à jour système',
      message: 'Une nouvelle version de l\'application est disponible avec des améliorations',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Marquée comme lue');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification supprimée');
  };

  const handleDeleteAll = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications lues ?')) {
      setNotifications(notifications.filter(n => !n.read));
      toast.success('Notifications supprimées');
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingBag;
      case 'rental': return Package;
      case 'review': return Star;
      case 'stock': return AlertCircle;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-600';
      case 'rental': return 'bg-purple-600';
      case 'review': return 'bg-yellow-500';
      case 'stock': return 'bg-red-600';
      case 'system': return 'bg-gray-700';
      default: return 'bg-primary';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date().getTime();
    const created = new Date(date).getTime();
    const diff = now - created;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    return `Il y a ${days} jours`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center relative">
                <Bell className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={handleDeleteAll}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer les lues
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 animate-slide-in-right">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'unread'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Non lues ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 animate-fade-in">
          {filteredNotifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);

            return (
              <div
                key={notification.id}
                className={`bg-card rounded-xl border overflow-hidden hover-lift transition-all ${
                  !notification.read ? 'border-primary shadow-sm' : 'border-border'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-primary ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Voir détails →
                          </a>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Marquer comme lu
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs text-red-600 hover:underline font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Aucune notification</h2>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? "Vous n'avez aucune notification pour le moment"
                : 'Toutes vos notifications ont été lues'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
