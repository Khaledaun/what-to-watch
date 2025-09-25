import { Metadata } from 'next'
import { AdminJobs } from '@/components/admin/AdminJobs'

export const metadata: Metadata = {
  title: 'Jobs & Scheduling | Admin Dashboard',
  description: 'Manage background jobs and scheduling',
  robots: 'noindex, nofollow',
}

export default function JobsPage() {
  return <AdminJobs />
}