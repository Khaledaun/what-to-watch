import { Metadata } from 'next'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'Admin Dashboard | YallaCinema',
  description: 'Admin dashboard for managing content, jobs, and settings',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex pt-16">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 p-6">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
