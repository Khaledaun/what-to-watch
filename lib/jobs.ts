// Re-export the real job system
export type { Job } from './real-jobs';
export { 
  RealJobScheduler as JobScheduler, 
  RealJobExecutor as JobExecutor,
  jobScheduler, 
  jobExecutor 
} from './real-jobs';

// Legacy compatibility
export interface LegacyJob {
  id: string
  type: string
  status: string
  priority: string
  payload: any
  attempts: number
  maxAttempts: number
  scheduledAt: string
  createdAt: string
  updatedAt: string
  error?: string
}