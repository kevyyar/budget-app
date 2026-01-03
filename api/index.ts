import { handle } from 'hono/vercel';
import app from '../apps/backend/server/app.js';

export default handle(app);
