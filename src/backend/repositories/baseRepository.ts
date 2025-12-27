import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository {
  protected readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  protected handleError(error: PostgrestError | null): void {
    if (error) {
      throw new Error(error.message);
    }
  }
}
