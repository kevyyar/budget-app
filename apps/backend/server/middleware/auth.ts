import { createMiddleware } from 'hono/factory';
import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env.js';
import { createRequestContext } from '../context.js';

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }

  const accessToken = authHeader.slice(7);

  const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  const appContext = createRequestContext(accessToken, user);
  c.set('appContext', appContext);

  await next();
});
