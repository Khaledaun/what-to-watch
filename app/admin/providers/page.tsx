import { Metadata } from 'next'
import { AdminProviders } from '@/components/admin/AdminProviders'

export const metadata: Metadata = {
  title: 'Watch Providers | Admin',
  description: 'Manage streaming service providers and their availability',
  robots: 'noindex, nofollow',
}

export default function AdminProvidersPage() {
  return <AdminProviders />
}
