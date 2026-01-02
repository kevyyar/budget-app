import { Hono } from 'hono';
import { getAppContext } from '../context.js';
import type { Expense, Category } from '../../types/index.js';

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface PaginatedExpenses {
  items: ExpenseWithCategory[];
  hasNextPage: boolean;
}

const app = new Hono();

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

app.get('/', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgetId = c.req.query('budget_id');
    const limitParam = c.req.query('limit');
    const offsetParam = c.req.query('offset');

    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Over-fetch by 1 to detect if there's a next page
    const expenses = await repos.expenses.listExpenses({
      budget_id: budgetId,
      limit: limit + 1,
      offset,
    });

    const hasNextPage = expenses.length > limit;
    const pageExpenses = hasNextPage ? expenses.slice(0, limit) : expenses;

    const categories = await repos.categories.listCategories();
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

    const items: ExpenseWithCategory[] = pageExpenses.map((expense) => ({
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

    return c.json({ items, hasNextPage } as PaginatedExpenses);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post('/', async (c) => {
  const { repos, user } = getAppContext(c);

  try {
    const body = await c.req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return c.json({ error: 'Invalid JSON body' }, 400);
    }

    const budgetId = (body as { budget_id?: unknown }).budget_id;
    const categoryId = (body as { category_id?: unknown }).category_id;
    const amount = (body as { amount?: unknown }).amount;
    const description = (body as { description?: unknown }).description;
    const expenseDate = (body as { expense_date?: unknown }).expense_date;
    const isFixed = (body as { is_fixed?: unknown }).is_fixed;

    if (!isNonEmptyString(budgetId)) {
      return c.json({ error: 'budget_id is required' }, 400);
    }
    if (!isNonEmptyString(categoryId)) {
      return c.json({ error: 'category_id is required' }, 400);
    }
    if (!isFiniteNumber(amount) || amount <= 0) {
      return c.json({ error: 'amount must be a positive number' }, 400);
    }
    if (description !== undefined && typeof description !== 'string') {
      return c.json({ error: 'description must be a string' }, 400);
    }
    if (expenseDate !== undefined && !isNonEmptyString(expenseDate)) {
      return c.json({ error: 'expense_date must be a date string' }, 400);
    }
    if (isFixed !== undefined && typeof isFixed !== 'boolean') {
      return c.json({ error: 'is_fixed must be a boolean' }, 400);
    }

    const expense = await repos.expenses.createExpense({
      budget_id: budgetId,
      category_id: categoryId,
      amount,
      description,
      expense_date: expenseDate,
      is_fixed: isFixed,
      user_id: user.id,
    });
    return c.json(expense, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.delete('/:id', async (c) => {
  const { repos } = getAppContext(c);
  const id = c.req.param('id');

  try {
    await repos.expenses.deleteExpense(id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
