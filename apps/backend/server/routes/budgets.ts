import { Hono } from 'hono';
import { getAppContext } from '../context.js';

const app = new Hono();

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isPaySchedule = (value: unknown): value is 'weekly' | 'biweekly' | 'monthly' =>
  value === 'weekly' || value === 'biweekly' || value === 'monthly';

app.get('/', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgets = await repos.budgets.listBudgets();
    return c.json(budgets);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.get('/current', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgets = await repos.budgets.listBudgets();
    const today = new Date().toISOString().split('T')[0];

    const current = budgets.find(
      (b) => b.period_start <= today && b.period_end >= today
    );

    if (!current) {
      return c.json({ error: 'No active budget found' }, 404);
    }

    return c.json(current);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.get('/:id', async (c) => {
  const { repos } = getAppContext(c);
  const id = c.req.param('id');

  try {
    const budget = await repos.budgets.getBudget(id);
    if (!budget) {
      return c.json({ error: 'Budget not found' }, 404);
    }
    return c.json(budget);
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

    const name = (body as { name?: unknown }).name;
    const periodStart = (body as { period_start?: unknown }).period_start;
    const periodEnd = (body as { period_end?: unknown }).period_end;
    const paySchedule = (body as { pay_schedule?: unknown }).pay_schedule;
    const incomePerPay = (body as { income_per_pay?: unknown }).income_per_pay;

    if (!isNonEmptyString(name)) {
      return c.json({ error: 'name is required' }, 400);
    }
    if (!isNonEmptyString(periodStart)) {
      return c.json({ error: 'period_start is required' }, 400);
    }
    if (!isNonEmptyString(periodEnd)) {
      return c.json({ error: 'period_end is required' }, 400);
    }
    if (!isPaySchedule(paySchedule)) {
      return c.json({ error: 'pay_schedule must be weekly, biweekly, or monthly' }, 400);
    }
    if (!isFiniteNumber(incomePerPay) || incomePerPay < 0) {
      return c.json({ error: 'income_per_pay must be a non-negative number' }, 400);
    }

    const budget = await repos.budgets.createBudget({
      name,
      period_start: periodStart,
      period_end: periodEnd,
      pay_schedule: paySchedule,
      income_per_pay: incomePerPay,
      user_id: user.id,
    });
    return c.json(budget, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
