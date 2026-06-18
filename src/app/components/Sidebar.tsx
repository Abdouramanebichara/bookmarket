import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import {
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  labelEn?: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
  divider?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onItemClick?: (item: SidebarItem) => boolean | void;
}

export function Sidebar({ items, collapsed: controlledCollapsed, onCollapsedChange, onItemClick }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLocalization();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggleCollapsed = () => {
    if (onCollapsedChange) {
      onCollapsedChange(!collapsed);
    } else {
      setInternalCollapsed(!collapsed);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <span className="font-bold text-lg">BookStore</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-xl">📚</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {items.map((item) => {
            if (item.divider) {
              return (
                <div key={item.id} className="my-4 border-t border-border" />
              );
            }

            const Icon = item.icon;
            const active = isActive(item.path);
            const label = language === 'fr' ? item.label : (item.labelEn || item.label);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onItemClick) {
                    const handled = onItemClick(item);
                    if (handled === true) return;
                  }
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-foreground' : ''}`} />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        active
                          ? 'bg-primary-foreground text-primary'
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}

                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <button
          onClick={handleToggleCollapsed}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">
                {language === 'fr' ? 'Réduire' : 'Collapse'}
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
