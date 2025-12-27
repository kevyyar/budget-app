export type PaySchedule = 'weekly' | 'biweekly' | 'monthly';

export interface Profile {
  id: string;
  pay_schedule: PaySchedule;
  income_per_pay: number;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  period_start: string;
  period_end: string;
  pay_schedule: PaySchedule;
  income_per_pay: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  slug: string;
  name: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  budget_id: string;
  category_id: string;
  amount: number;
  description: string;
  expense_date: string;
  is_fixed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsDaily {
  user_id: string;
  budget_id: string;
  day: string;
  total_amount: number;
  fixed_amount: number;
  variable_amount: number;
  expense_count: number;
}

export interface AnalyticsWeekly {
  user_id: string;
  budget_id: string;
  week_start: string;
  total_amount: number;
  fixed_amount: number;
  variable_amount: number;
  expense_count: number;
}

export interface AnalyticsMonthly {
  user_id: string;
  budget_id: string;
  month_start: string;
  total_amount: number;
  fixed_amount: number;
  variable_amount: number;
  expense_count: number;
}
