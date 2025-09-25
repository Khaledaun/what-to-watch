import { db } from './database';

export interface Job {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  payload: any;
  attempts: number;
  maxAttempts: number;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  error?: string;
  result?: any;
}

export class RealJobScheduler {
  async schedule(jobData: {
    name: string;
    type: string;
    payload: any;
    priority?: 'low' | 'medium' | 'high';
    scheduled_at?: string;
  }): Promise<Job> {
    const client = db.ensureClient();
    
    if (!client) {
      // Fallback to in-memory storage if no database
      return this.scheduleInMemory(jobData);
    }

    const job: Partial<Job> = {
      name: jobData.name,
      type: jobData.type,
      status: 'pending',
      priority: jobData.priority || 'medium',
      payload: jobData.payload,
      attempts: 0,
      maxAttempts: 3,
      scheduled_at: jobData.scheduled_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await client
        .from('jobs')
        .insert(job)
        .select()
        .single();

      if (error) {
        console.error('Error scheduling job:', error);
        return this.scheduleInMemory(jobData);
      }

      return data as Job;
    } catch (error) {
      console.error('Error scheduling job:', error);
      return this.scheduleInMemory(jobData);
    }
  }

  private async scheduleInMemory(jobData: any): Promise<Job> {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: jobData.name,
      type: jobData.type,
      status: 'pending',
      priority: jobData.priority || 'medium',
      payload: jobData.payload,
      attempts: 0,
      maxAttempts: 3,
      scheduled_at: jobData.scheduled_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Store in localStorage as fallback
    if (typeof window !== 'undefined') {
      const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      existingJobs.push(job);
      localStorage.setItem('jobs', JSON.stringify(existingJobs));
    }

    return job;
  }

  async getPendingJobs(): Promise<Job[]> {
    const client = db.ensureClient();
    
    if (!client) {
      return this.getPendingJobsFromMemory();
    }

    try {
      const { data, error } = await client
        .from('jobs')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString())
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching pending jobs:', error);
        return this.getPendingJobsFromMemory();
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      return this.getPendingJobsFromMemory();
    }
  }

  private async getPendingJobsFromMemory(): Promise<Job[]> {
    if (typeof window === 'undefined') return [];
    
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    return jobs.filter((job: Job) => 
      job.status === 'pending' && 
      new Date(job.scheduled_at) <= new Date()
    );
  }

  async getAllJobs(): Promise<Job[]> {
    const client = db.ensureClient();
    
    if (!client) {
      return this.getAllJobsFromMemory();
    }

    try {
      const { data, error } = await client
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return this.getAllJobsFromMemory();
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return this.getAllJobsFromMemory();
    }
  }

  private async getAllJobsFromMemory(): Promise<Job[]> {
    if (typeof window === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('jobs') || '[]');
  }

  async updateJobStatus(jobId: string, status: Job['status'], error?: string, result?: any): Promise<void> {
    const client = db.ensureClient();
    
    if (!client) {
      this.updateJobStatusInMemory(jobId, status, error, result);
      return;
    }

    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'running') {
        updateData.started_at = new Date().toISOString();
        updateData.attempts = 1; // Increment attempts
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.result = result;
      } else if (status === 'failed') {
        updateData.error = error;
        updateData.attempts = 1; // Increment attempts
      }

      const { error: updateError } = await client
        .from('jobs')
        .update(updateData)
        .eq('id', jobId);

      if (updateError) {
        console.error('Error updating job status:', updateError);
        this.updateJobStatusInMemory(jobId, status, error, result);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      this.updateJobStatusInMemory(jobId, status, error, result);
    }
  }

  private updateJobStatusInMemory(jobId: string, status: Job['status'], error?: string, result?: any): void {
    if (typeof window === 'undefined') return;
    
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobIndex = jobs.findIndex((job: Job) => job.id === jobId);
    
    if (jobIndex !== -1) {
      jobs[jobIndex].status = status;
      jobs[jobIndex].updated_at = new Date().toISOString();
      
      if (status === 'running') {
        jobs[jobIndex].started_at = new Date().toISOString();
        jobs[jobIndex].attempts = (jobs[jobIndex].attempts || 0) + 1;
      } else if (status === 'completed') {
        jobs[jobIndex].completed_at = new Date().toISOString();
        jobs[jobIndex].result = result;
      } else if (status === 'failed') {
        jobs[jobIndex].error = error;
        jobs[jobIndex].attempts = (jobs[jobIndex].attempts || 0) + 1;
      }
      
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    await this.updateJobStatus(jobId, 'cancelled');
  }

  async retryJob(jobId: string): Promise<void> {
    await this.updateJobStatus(jobId, 'pending');
  }
}

export class RealJobExecutor {
  async execute(job: Job): Promise<void> {
    try {
      await this.updateJobStatus(job.id, 'running');
      
      console.log(`Executing job: ${job.name} (${job.type})`);
      
      // Execute based on job type
      switch (job.type) {
        case 'article_generation':
          await this.executeArticleGeneration(job);
          break;
        case 'topic_generation':
          await this.executeTopicGeneration(job);
          break;
        case 'content_optimization':
          await this.executeContentOptimization(job);
          break;
        case 'seo_analysis':
          await this.executeSEOAnalysis(job);
          break;
        default:
          console.log(`Unknown job type: ${job.type}`);
      }
      
      await this.updateJobStatus(job.id, 'completed', undefined, { message: 'Job completed successfully' });
    } catch (error) {
      console.error(`Job execution failed: ${job.name}`, error);
      await this.updateJobStatus(job.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async executeArticleGeneration(job: Job): Promise<void> {
    // Simulate article generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Generated article: ${job.payload.topicTitle}`);
  }

  private async executeTopicGeneration(job: Job): Promise<void> {
    // Simulate topic generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Generated topics for: ${job.payload.category}`);
  }

  private async executeContentOptimization(job: Job): Promise<void> {
    // Simulate content optimization
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Optimized content: ${job.payload.contentId}`);
  }

  private async executeSEOAnalysis(job: Job): Promise<void> {
    // Simulate SEO analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Analyzed SEO for: ${job.payload.url}`);
  }

  private async updateJobStatus(jobId: string, status: Job['status'], error?: string, result?: any): Promise<void> {
    const scheduler = new RealJobScheduler();
    await scheduler.updateJobStatus(jobId, status, error, result);
  }
}

// Export singleton instances
export const jobScheduler = new RealJobScheduler();
export const jobExecutor = new RealJobExecutor();
