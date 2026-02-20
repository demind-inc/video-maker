/**
 * Vercel serverless catch-all: forwards /api/* and /output to the Express app.
 * Requires server to be built (server/dist) before deploy.
 */
// @ts-ignore - built output; path resolved at runtime
import app from '../server/dist/app.js';
export default app;
