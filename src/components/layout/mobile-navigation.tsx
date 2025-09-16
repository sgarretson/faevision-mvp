'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  TrendingUp,
  Users,
  Settings,
  Menu,
  X,
  BarChart3,
  FileText,
  Bell,
} from 'lucide-react';

/**
 * Mobile Navigation Component
 *
 * Executive-optimized mobile navigation:
 * - Thumb-friendly positioning (bottom nav)
 * - Quick access to key executive functions
 * - Badge notifications for urgent items
 * - Smooth transitions and haptic feedback patterns
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Based on executive mobile usage research
 */

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and KPIs',
  },
  {
    name: 'Hotspots',
    href: '/hotspots',
    icon: TrendingUp,
    description: 'AI-clustered signals',
    badge: true, // Show badge for new hotspots
  },
  {
    name: 'Solutions',
    href: '/solutions',
    icon: FileText,
    description: 'Active solutions',
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    description: 'Team management',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance metrics',
  },
];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Bottom Navigation Bar (Primary) */}
      <div className="safe-area-pb fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white lg:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-1">
          {navigationItems.slice(0, 4).map(item => (
            <MobileNavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-50 rounded-full bg-blue-600 p-3 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Slide-out Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed bottom-0 right-0 top-0 z-50 w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    FAEVision
                  </h2>
                  <p className="text-sm text-gray-500">Executive Dashboard</p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-2 px-4">
                  {navigationItems.map(item => (
                    <MobileMenuItemFull
                      key={item.name}
                      item={item}
                      isActive={pathname === item.href}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8 px-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <QuickActionButton
                      icon={<TrendingUp className="h-4 w-4" />}
                      label="Run Clustering"
                      onClick={() => {
                        setIsOpen(false);
                        // TODO: Trigger clustering
                      }}
                    />
                    <QuickActionButton
                      icon={<Bell className="h-4 w-4" />}
                      label="View Notifications"
                      onClick={() => {
                        setIsOpen(false);
                        // TODO: Show notifications
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-medium text-blue-600">E</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Executive User
                    </p>
                    <p className="text-xs text-gray-500">Last active: now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/**
 * Bottom navigation item component
 */
function MobileNavItem({
  item,
  isActive,
}: {
  item: (typeof navigationItems)[0];
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="relative">
      <div
        className={`flex min-h-[64px] flex-col items-center justify-center rounded-lg px-1 py-2 transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        } `}
      >
        <div className="relative">
          <Icon className="h-6 w-6" />
          {item.badge && (
            <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
              <span className="text-xs font-medium text-white">2</span>
            </div>
          )}
        </div>
        <span className="mt-1 text-center text-xs font-medium leading-tight">
          {item.name}
        </span>
      </div>
    </Link>
  );
}

/**
 * Full menu item component
 */
function MobileMenuItemFull({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navigationItems)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link href={item.href} onClick={onClick}>
      <div
        className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-50'
        } `}
      >
        <div className="relative">
          <Icon className="h-5 w-5" />
          {item.badge && (
            <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{item.name}</p>
          <p className="text-xs text-gray-500">{item.description}</p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Quick action button component
 */
function QuickActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center space-x-3 rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
    >
      <div className="text-gray-600">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
