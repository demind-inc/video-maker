import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import cors from 'cors';
import { analyzeRouter } from './routes/analyze.js';
import { renderRouter } from './routes/render.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analyze', analyzeRouter);
app.use('/api/render', renderRouter);

// Serve rendered videos (local: server/output; Vercel: /tmp/output)
const outputDir =
  process.env.VERCEL === '1'
    ? path.join('/tmp', 'output')
    : path.join(__dirname, '..', 'output');
app.use('/output', express.static(outputDir));
// Vercel rewrites /output/* to /api/output/*, so serve there too
app.use('/api/output', express.static(outputDir));

export default app;
