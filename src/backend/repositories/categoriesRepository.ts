import type { Category } from '../types/index.js';
import { BaseRepository } from './baseRepository.js';

export interface CreateCategoryInput {
  slug: string;
  name: string;
  color: string;
  icon: string;
  sort_order?: number;
}

export interface UpdateCategoryInput {
  slug?: string;
  name?: string;
  color?: string;
  icon?: string;
  sort_order?: number;
}

export class CategoriesRepository extends BaseRepository {
  async listCategories(): Promise<Category[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    this.handleError(error);
    return (data ?? []) as Category[];
  }

  async createCategory(payload: CreateCategoryInput): Promise<Category> {
    const { data, error } = await this.client
      .from('categories')
      .insert(payload)
      .select('*')
      .single();

    this.handleError(error);
    return data as Category;
  }

  async updateCategory(id: string, payload: UpdateCategoryInput): Promise<Category> {
    const { data, error } = await this.client
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError(error);
    return data as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.client
      .from('categories')
      .delete()
      .eq('id', id);

    this.handleError(error);
  }
}
