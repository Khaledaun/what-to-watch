import { Metadata } from 'next'
import { AdminSettings } from '@/components/admin/AdminSettings'

export const metadata: Metadata = {
  title: 'Settings & Access | Admin Dashboard',
  description: 'Configure API keys, system settings, and user access',
  robots: 'noindex, nofollow',
}

export default function SettingsPage() {
  return <AdminSettings />
}
