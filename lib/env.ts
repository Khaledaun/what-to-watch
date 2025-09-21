import { z } from 'zod'

const envSchema = z.object({
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is required'),
  OMDB_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  REDIS_TOKEN: z.string().optional(),
  ORIGIN: z.string().url().default('https://localhost:3000'),
  DEFAULT_COUNTRIES: z.string().default('US,CA'),
  CACHE_TTL_SECONDS: z.coerce.number().default(900),
  
  // Feature flags
  NEXT_PUBLIC_FEATURE_TRAILERS: z.string().optional(),
  FEATURE_JUSTWATCH: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  
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
