import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  Download,
  Upload
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    to: '/dashboard',
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: CreditCard,
    to: '/expenses',
    badge: 'New',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    to: '#analytics',
  },
  {
    id: 'trends',
    label: 'Trends',
    icon: TrendingUp,
    to: '#trends',
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    to: '#export',
  },
  {
    id: 'import',
    label: 'Import',
    icon: Upload,
    to: '#import',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    to: '#settings',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = isActiveRoute(item.to);
    const isExternal = item.to.startsWith('#');
    
    if (isExternal) {
      return (
        <a
          key={item.id}
          href={item.to}
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive
              ? 'text-primary bg-primary/10'
              : 'text-gray-700 hover:text-primary hover:bg-gray-50'
          }`}
        >
          <item.icon className={`mr-3 h-5 w-5 ${
            isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
          }`} />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
              {item.badge}
            </span>
          )}
        </a>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.to}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'text-primary bg-primary/10'
            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
        }`}
        onClick={onClose}
      >
        <item.icon className={`mr-3 h-5 w-5 ${
          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
        }`} />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map(renderNavItem)}
          </nav>

          {/* Quick actions */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/expenses"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                onClick={onClose}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Link>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Expenses Management System</p>
              <p className="mt-1">v0.1.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
