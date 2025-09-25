import { z } from 'zod'

const envSchema = z.object({
  // TMDB Configuration
  TMDB_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_REGION_DEFAULT: z.string().default('US'),
  REGION_FALLBACK: z.string().default('CA'),
  
  // Database
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  
  // Redis (Optional for BullMQ)
  REDIS_URL: z.string().optional(),
  
  // Site Configuration
  SITE_BRAND_NAME: z.string().default('YallaCinema'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://yallacinema.com'),
  
  // Admin Auth
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Cron Jobs
  CRON_SECRET: z.string().optional(),
  
  // SEO & Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  GOOGLE_SITE_VERIFICATION: z.string().optional(),
  
  // Content Generation
  OPENAI_API_KEY: z.string().optional(),
  CONTENT_GENERATION_ENABLED: z.string().default('true'),
  DEFAULT_AI_PROVIDER: z.string().default('openai'),
  
  // Grok AI Integration
  GROK_API_KEY: z.string().optional(),
  GROK_MODEL: z.string().default('grok-4-fast-reasoning'),
  
  // Claude AI Integration
  CLAUDE_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Email Configuration
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  
  // Legacy/Compatibility
  OMDB_API_KEY: z.string().optional(),
  REDIS_TOKEN: z.string().optional(),
  ORIGIN: z.string().url().default('https://localhost:3000'),
  DEFAULT_COUNTRIES: z.string().default('US,CA'),
  CACHE_TTL_SECONDS: z.coerce.number().default(900),
  NEXT_PUBLIC_FEATURE_TRAILERS: z.string().optional(),
  FEATURE_JUSTWATCH: z.string().optional(),
  
  // Security
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
    throw new Error(`Environment validation failed:\n${missingVars}`)
  }
  throw error
}

export { env }

export const getDefaultCountries = (): string[] => {
  return env.DEFAULT_COUNTRIES.split(',').map(c => c.trim())
}
