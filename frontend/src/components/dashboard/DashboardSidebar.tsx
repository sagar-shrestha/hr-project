import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  UserPlus,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  subItems?: { name: string; href: string; icon: any }[];
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/dashboard/employees', icon: Users },
  { name: 'Time Off', href: '/dashboard/time-off', icon: Calendar },
  { name: 'Payroll', href: '/dashboard/payroll', icon: DollarSign },
  { name: 'Recruitment', href: '/dashboard/recruitment', icon: UserPlus },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    subItems: [
      { name: 'Permissions', href: '/permissions', icon: Shield },
    ]
  },
];

const superAdminItems: NavItem[] = [
  { name: 'User Management', href: '/dashboard/users', icon: UserCog },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Settings', 'Administration']);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRoles = userData.roles || [];
  const canManageUsers = userRoles.some((role: string) =>
    ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MODERATOR'].includes(role)
  );

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-card border-r border-border"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent flex-shrink-0">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-display font-bold overflow-hidden whitespace-nowrap"
              >
                HRMS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('flex-shrink-0', collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const active = isActive(item.href) || (hasSubItems && item.subItems?.some(sub => isActive(sub.href)));

          return (
            <div key={item.name} className="space-y-1">
              {hasSubItems ? (
                <button
                  onClick={() => !collapsed && toggleExpand(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-primary')} />
                    {!collapsed && (
                      <span className="font-medium overflow-hidden whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                  )}
                </button>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.href) && 'text-primary-foreground')} />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium overflow-hidden whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* Subitems */}
              <AnimatePresence>
                {hasSubItems && isExpanded && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-11 space-y-1"
                  >
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                          isActive(subItem.href)
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {canManageUsers && (
          <div className="pt-4 mt-4 border-t border-border/50">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </p>
            )}
            {superAdminItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive(item.href) && 'text-accent-foreground')} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className={cn('w-full justify-start gap-3', collapsed && 'justify-center px-0')}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.aside>
  );
}
