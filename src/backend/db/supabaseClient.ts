import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

const baseOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
};

export class SupabaseClientFactory {
  private readonly url: string;
  private readonly anonKey: string;
  private readonly serviceRoleKey?: string;

  constructor() {
    this.url = env.supabaseUrl;
    this.anonKey = env.supabaseAnonKey;
    this.serviceRoleKey = env.supabaseServiceRoleKey;
  }

  createAnonClient(): SupabaseClient {
    return createClient(this.url, this.anonKey, baseOptions);
  }

  createServiceClient(): SupabaseClient {
    if (!this.serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient(this.url, this.serviceRoleKey, baseOptions);
  }

  createUserClient(accessToken: string): SupabaseClient {
    return createClient(this.url, this.anonKey, {
      ...baseOptions,
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    });
  }
}
