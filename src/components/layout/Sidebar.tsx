import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  ListChecks,
  Store,
  Truck,
  LayoutDashboard,
  LogOut,
  Leaf,
  History,
} from 'lucide-react';

const menuItems = {
  customer: [
    { icon: ShoppingCart, label: 'Shop', path: '/shop' },
    { icon: History, label: 'Order History', path: '/orders' },
    { icon: ListChecks, label: 'Shopping List', path: '/shopping-list' },
  ],
  store_owner: [
    { icon: Store, label: 'Store', path: '/store' },
  ],
  delivery: [
    { icon: Truck, label: 'Delivery', path: '/delivery' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Admin', path: '/admin' },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const allItems = [
    ...menuItems.customer,
    ...(user.role === 'admin' ? menuItems.admin : []),
    ...(user.role === 'store_owner' || user.role === 'admin' ? menuItems.store_owner : []),
    ...(user.role === 'delivery' || user.role === 'admin' ? menuItems.delivery : []),
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 sidebar-nav flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">GrocerAI</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {allItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              location.pathname === item.path
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
