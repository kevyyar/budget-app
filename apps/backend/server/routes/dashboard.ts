import { Hono } from 'hono';
import { getAppContext } from '../context.js';
import type { Expense, Category } from '../../types/index.js';

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

const app = new Hono();

app.get('/summary', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgets = await repos.budgets.listBudgets();
    const today = new Date().toISOString().split('T')[0];

    const currentBudget = budgets.find(
      (b) => b.period_start <= today && b.period_end >= today
    );

    if (!currentBudget) {
      return c.json({ error: 'No active budget found' }, 404);
    }

    const [expenses, categories] = await Promise.all([
      repos.expenses.listExpenses({ budget_id: currentBudget.id }),
      repos.categories.listCategories(),
    ]);

    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

    const spent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const fixedAmount = expenses
      .filter((e) => e.is_fixed)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const variableAmount = spent - fixedAmount;

    const periodEnd = new Date(currentBudget.period_end);
    const todayDate = new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((periodEnd.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const recentExpenses: ExpenseWithCategory[] = expenses
      .slice(0, 4)
      .map((expense) => ({
        ...expense,
        category: categoryMap.get(expense.category_id) ?? {
          id: expense.category_id,
          user_id: null,
          slug: 'other',
          name: 'Other',
          color: '#6b7280',
          icon: 'pi pi-tag',
          sort_order: 99,
          created_at: '',
          updated_at: '',
        },
      }));

    const summary: DashboardSummary = {
      budget: {
        id: currentBudget.id,
        name: currentBudget.name,
        period_start: currentBudget.period_start,
        period_end: currentBudget.period_end,
        income_per_pay: currentBudget.income_per_pay,
      },
      income: Number(currentBudget.income_per_pay),
      spent,
      daysRemaining,
      fixedAmount,
      variableAmount,
      recentExpenses,
    };

    return c.json(summary);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
