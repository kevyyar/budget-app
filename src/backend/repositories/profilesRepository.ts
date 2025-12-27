import type { Profile } from '../types/index.js';
import { BaseRepository } from './baseRepository.js';

export class ProfilesRepository extends BaseRepository {
  async getOwnProfile(): Promise<Profile | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error);
    }

    return data ?? null;
  }

  async upsertOwnProfile(payload: Pick<Profile, 'id' | 'pay_schedule' | 'income_per_pay'>): Promise<Profile> {
    const { data, error } = await this.client
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    this.handleError(error);
    return data as Profile;
  }
}
