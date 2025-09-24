import { Metadata } from 'next'
import { AdminTitles } from '@/components/admin/AdminTitles'

export const metadata: Metadata = {
  title: 'Titles & Factsheets | Admin',
  description: 'Manage movie and TV show titles and their factsheets',
  robots: 'noindex, nofollow',
}

export default function AdminTitlesPage() {
  return <AdminTitles />
}
