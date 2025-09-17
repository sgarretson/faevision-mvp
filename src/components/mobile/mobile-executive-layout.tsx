'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  BarChart3,
  Target,
  Lightbulb,
  Brain,
  Zap,
  Activity,
  Plus,
  Search,
  Bell,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sprint 3 Story 4: Mobile Executive Experience
 * Expert Lead: Maya Rodriguez (UX Expert) + David Chen (Visual Designer)
 * Support: Alex Thompson (Lead Developer)
 *
 * Mobile-optimized layout for executive workflows with 44px touch targets
 * and meeting-friendly capture capabilities
 */

interface MobileExecutiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  quickActions?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon: React.ReactNode;
    badge?: number;
  }[];
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, badge: 0 },
  { name: 'Hotspots', href: '/hotspots', icon: Zap, badge: 3 },
  { name: 'Inputs', href: '/inputs', icon: Target, badge: 8 },
  { name: 'Ideas', href: '/ideas', icon: Brain, badge: 0 },
  { name: 'Solutions', href: '/solutions', icon: Lightbulb, badge: 2 },
  {
    name: 'Performance',
    href: '/monitoring/performance',
    icon: Activity,
    badge: 0,
  },
];

export function MobileExecutiveLayout({
  children,
  title,
  subtitle,
  showSearch = false,
  showNotifications = true,
  primaryAction,
  quickActions = [],
}: MobileExecutiveLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Don't show mobile layout on non-mobile devices or unauthenticated users
  if (!isMobile || status === 'unauthenticated') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section - Menu & Title */}
            <div className="flex min-w-0 flex-1 items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="-ml-2 touch-manipulation rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                {title && (
                  <h1 className="truncate text-lg font-semibold text-gray-900">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="truncate text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              {showSearch && (
                <button
                  className="touch-manipulation rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {showNotifications && (
                <button
                  className="relative touch-manipulation rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              )}

              <button
                className="touch-manipulation rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          {primaryAction && (
            <div className="mt-3">
              {primaryAction.href ? (
                <Link
                  href={primaryAction.href}
                  className="flex w-full touch-manipulation items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                  style={{ minHeight: '44px' }}
                >
                  {primaryAction.icon && (
                    <span className="mr-2">{primaryAction.icon}</span>
                  )}
                  {primaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={primaryAction.onClick}
                  className="flex w-full touch-manipulation items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                  style={{ minHeight: '44px' }}
                >
                  {primaryAction.icon && (
                    <span className="mr-2">{primaryAction.icon}</span>
                  )}
                  {primaryAction.label}
                </button>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <QuickActionButton key={index} action={action} />
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="fixed bottom-0 left-0 top-0 flex w-80 max-w-sm flex-col bg-white shadow-xl">
            {/* Navigation Header */}
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-sm font-bold text-white">FAE</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">FAEVision</div>
                    <div className="text-xs text-gray-600">
                      {session?.user?.name || 'Executive'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {navigationItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex touch-manipulation items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'border border-blue-200 bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                    style={{ minHeight: '44px' }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-bold leading-none text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="text-center text-xs text-gray-500">
                Version 2.0 • Mobile Optimized
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">{children}</main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

function QuickActionButton({
  action,
}: {
  action: NonNullable<MobileExecutiveLayoutProps['quickActions']>[0];
}) {
  const content = (
    <div className="relative flex touch-manipulation items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200">
      <div className="flex items-center space-x-2">
        {action.icon}
        <span className="text-sm font-medium">{action.label}</span>
      </div>
      {action.badge && action.badge > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold leading-none text-white">
          {action.badge}
        </span>
      )}
    </div>
  );

  if (action.href) {
    return <Link href={action.href}>{content}</Link>;
  }

  return <button onClick={action.onClick}>{content}</button>;
}

function BottomNavigation() {
  const pathname = usePathname();

  const bottomNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Hotspots', href: '/hotspots', icon: Zap },
    { name: 'Inputs', href: '/inputs', icon: Target },
    { name: 'Solutions', href: '/solutions', icon: Lightbulb },
    { name: 'Create', href: '/inputs/create', icon: Plus },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white">
      <div className="grid grid-cols-5">
        {bottomNavItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex touch-manipulation flex-col items-center justify-center px-1 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              style={{ minHeight: '44px' }}
            >
              <item.icon className="mb-1 h-5 w-5" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
