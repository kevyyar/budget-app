export type RuntimeEnv = 'development' | 'test' | 'production' | string;

export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  env: RuntimeEnv;
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
  env: process.env.ENV ?? 'development'
};
