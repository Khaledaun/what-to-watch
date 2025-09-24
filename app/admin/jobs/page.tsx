import { Metadata } from 'next'
import { AdminJobs } from '@/components/admin/AdminJobs'

export const metadata: Metadata = {
  title: 'Jobs & Scheduling | Admin',
  description: 'Monitor and manage background jobs and scheduled tasks',
  robots: 'noindex, nofollow',
}

export default function AdminJobsPage() {
  return <AdminJobs />
}
