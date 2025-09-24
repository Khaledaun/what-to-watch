import { Metadata } from 'next'
import { AdminAudit } from '@/components/admin/AdminAudit'

export const metadata: Metadata = {
  title: 'Audit & Observability | Admin',
  description: 'System audit logs and observability dashboard',
  robots: 'noindex, nofollow',
}

export default function AdminAuditPage() {
  return <AdminAudit />
}
