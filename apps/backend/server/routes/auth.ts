import { Hono } from 'hono';
import { getAppContext } from '../context.js';

const app = new Hono();

app.get('/me', (c) => {
  const { user } = getAppContext(c);
  return c.json({
    id: user.id,
    email: user.email,
  });
});

export default app;
