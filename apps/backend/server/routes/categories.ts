import { Hono } from 'hono';
import { getAppContext } from '../context.js';

const app = new Hono();

app.get('/', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const categories = await repos.categories.listCategories();
    return c.json(categories);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
