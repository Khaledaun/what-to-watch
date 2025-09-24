"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Overview', href: '/admin', icon: '📊' },
  { name: 'TMDB Ingest', href: '/admin/tmdb', icon: '🎬' },
  { name: 'Titles & Factsheets', href: '/admin/titles', icon: '📚' },
  { name: 'Watch Providers', href: '/admin/providers', icon: '📺' },
  { name: 'Content Studio', href: '/admin/content', icon: '✍️' },
  { name: 'News Hub', href: '/admin/news', icon: '📰' },
  { name: 'Jobs & Scheduling', href: '/admin/jobs', icon: '⚙️' },
  { name: 'Settings & Access', href: '/admin/settings', icon: '🔧' },
  { name: 'Audit & Observability', href: '/admin/audit', icon: '📋' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:pb-0 lg:bg-white lg:border-r lg:border-gray-200">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
        >
          <span className="mr-3">🏠</span>
          Back to Site
        </Link>
      </div>
    </div>
  );
}
