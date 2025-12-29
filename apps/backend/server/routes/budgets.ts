import { Hono } from 'hono';
import { getAppContext } from '../context.js';

const app = new Hono();

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
    const body = await c.req.json();
    const budget = await repos.budgets.createBudget({
      ...body,
      user_id: user.id,
    });
    return c.json(budget, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
