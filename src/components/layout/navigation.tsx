'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Target,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Signal Hotspots', href: '/hotspots', icon: Zap },
  { name: 'Strategic Inputs', href: '/inputs', icon: Target },
  { name: 'Solutions', href: '/solutions', icon: Lightbulb },
  { name: 'Create Input', href: '/inputs/create', icon: Plus },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Don't show navigation on login/signup pages or home page
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-sm font-bold text-white">FAE</span>
                </div>
                <span className="font-semibold text-gray-900">Vision</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {session.user?.role}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center border-l-4 px-3 py-2 text-base font-medium transition-colors',
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile user menu */}
          <div className="border-t border-gray-200 pb-3 pt-4">
            {session ? (
              <div className="space-y-3 px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {session.user?.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session.user?.email}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
