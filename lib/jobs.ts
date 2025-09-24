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
  error?: string
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

  async cancel(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (job && job.status === 'queued') {
      job.status = 'cancelled'
      job.updatedAt = new Date().toISOString()
      this.jobs.set(jobId, job)
    }
  }

  async retry(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (job && job.status === 'failed' && job.attempts < job.maxAttempts) {
      job.status = 'queued'
      job.attempts = 0
      job.error = undefined
      job.updatedAt = new Date().toISOString()
      this.jobs.set(jobId, job)
    }
  }

  async processQueue(): Promise<void> {
    // Mock queue processing
    console.log('Processing job queue...')
  }
}

export const jobScheduler = new MockJobScheduler()

// Export jobExecutor for compatibility
export const jobExecutor = {
  async execute(job: Job): Promise<void> {
    // Mock job execution
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Executing job: ${job.type}`)
  },
  async executeJob(job: Job): Promise<void> {
    // Alias for execute method
    return this.execute(job)
  }
}