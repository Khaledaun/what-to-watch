import { Metadata } from 'next'
import { AdminNews } from '@/components/admin/AdminNews'

export const metadata: Metadata = {
  title: 'News Hub | Admin',
  description: 'Manage news articles and content',
  robots: 'noindex, nofollow',
}

export default function AdminNewsPage() {
  return <AdminNews />
}
