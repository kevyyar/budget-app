export type RuntimeEnv = 'development' | 'test' | 'production' | string;

export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  port: number;
  env: RuntimeEnv;
  corsOrigins: string[];
  allowVercelPreview: boolean;
}

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const env: EnvConfig = {
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseAnonKey: requireEnv('SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  port: parseInt(process.env.PORT ?? '3001', 10),
  env: process.env.ENV ?? 'development',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  allowVercelPreview: (process.env.CORS_ALLOW_VERCEL_PREVIEW ?? 'false').toLowerCase() === 'true',
};
