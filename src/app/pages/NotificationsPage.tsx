import { useNavigate } from 'react-router';
import { useNotifications, NotificationType } from '../context/NotificationsContext';
import { useLocalization } from '../context/LocalizationContext';
import {
  Bell, CheckCheck, Trash2, Package, ShoppingBag, Calendar,
  FileText, Star, Wallet, RotateCcw, X
} from 'lucide-react';

const notifConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  order_confirmed:      { icon: ShoppingBag, color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30' },
  order_shipped:        { icon: Package,     color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  order_delivered:      { icon: Package,     color: 'text-green-700',  bg: 'bg-green-100 dark:bg-green-900/30' },
  rental_started:       { icon: Calendar,    color: 'text-primary',    bg: 'bg-primary/10' },
  rental_expiring_soon: { icon: Calendar,    color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  rental_overdue:       { icon: Calendar,    color: 'text-red-600',    bg: 'bg-red-100 dark:bg-red-900/30' },
  rental_returned:      { icon: RotateCcw,   color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  digital_available:    { icon: FileText,    color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  favorite_in_stock:    { icon: Package,     color: 'text-pink-600',   bg: 'bg-pink-100 dark:bg-pink-900/30' },
  review_published:     { icon: Star,        color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  wallet_recharged:     { icon: Wallet,      color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30' },
  wallet_deducted:      { icon: Wallet,      color: 'text-red-600',    bg: 'bg-red-100 dark:bg-red-900/30' },
  return_validated:     { icon: CheckCheck,  color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30' },
};

function timeAgo(dateStr: string, language: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return language === 'fr' ? "À l'instant" : 'Just now';
  if (mins < 60) return language === 'fr' ? `Il y a ${mins} min` : `${mins}m ago`;
  if (hours < 24) return language === 'fr' ? `Il y a ${hours}h` : `${hours}h ago`;
  return language === 'fr' ? `Il y a ${days}j` : `${days}d ago`;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { language } = useLocalization();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {language === 'fr' ? 'Notifications' : 'Notifications'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0
                  ? (language === 'fr' ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : `${unreadCount} unread`)
                  : (language === 'fr' ? 'Tout est à jour' : 'All caught up')}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              {language === 'fr' ? 'Tout marquer lu' : 'Mark all read'}
            </button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {language === 'fr' ? 'Aucune notification' : 'No notifications'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'fr'
                ? 'Vous serez notifié ici lors de vos achats, locations et bien plus.'
                : "You'll be notified here for purchases, rentals and more."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const cfg = notifConfig[notif.type] || notifConfig.order_confirmed;
              const Icon = cfg.icon;
              return (
                <div
                  key={notif.id}
                  className={`relative bg-card rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                    notif.read ? 'border-border opacity-80' : 'border-primary/40 shadow-sm'
                  }`}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) navigate(notif.link);
                  }}
                >
                  {!notif.read && (
                    <span className="absolute top-4 right-10 w-2.5 h-2.5 bg-primary rounded-full" />
                  )}

                  <div className="flex items-start gap-4 p-5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-semibold text-sm ${notif.read ? '' : 'text-foreground'}`}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                          {timeAgo(notif.date, language)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                      className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
