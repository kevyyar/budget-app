export type PaySchedule = 'weekly' | 'biweekly' | 'monthly';

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

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface DashboardSummary {
  budget: {
    id: string;
    name: string;
    period_start: string;
    period_end: string;
    income_per_pay: number;
  };
  income: number;
  spent: number;
  daysRemaining: number;
  fixedAmount: number;
  variableAmount: number;
  recentExpenses: ExpenseWithCategory[];
}
