export interface Job {
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
}

export class MockJobScheduler {
  private jobs: Map<string, Job> = new Map()

  async schedule(jobData: any): Promise<Job> {
    const job: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: 'queued',
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.jobs.set(job.id, job)
    return job
  }

  async listJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values())
  }
}

export const jobScheduler = new MockJobScheduler()