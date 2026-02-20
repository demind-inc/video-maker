import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from server directory (works when running from root or server/)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import { analyzeRouter } from './routes/analyze.js';
import { renderRouter } from './routes/render.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analyze', analyzeRouter);
app.use('/api/render', renderRouter);

// Serve rendered videos
const outputDir = path.join(__dirname, '..', 'output');
app.use('/output', express.static(outputDir));

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
