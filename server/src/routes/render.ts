import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Server package root (render.ts is in src/routes/)
const serverDir = path.join(__dirname, '..', '..');
const remotionEntry = path.join(serverDir, 'remotion', 'index.tsx');
const outputDir = path.join(serverDir, 'output');

let cachedServeUrl: string | null = null;

const router = Router();

router.post('/', async (req, res) => {
  const { title, description, image } = req.body as {
    title?: string;
    description?: string;
    image?: string;
  };

  const inputProps = {
    title: typeof title === 'string' ? title : 'Product',
    description: typeof description === 'string' ? description : '',
    image: typeof image === 'string' ? image : undefined,
  };

  try {
    if (!cachedServeUrl) {
      cachedServeUrl = await bundle({
        entryPoint: remotionEntry,
        webpackOverride: (config) => config,
        rootDir: serverDir,
      });
    }

    const composition = await selectComposition({
      serveUrl: cachedServeUrl,
      id: 'Teaser',
      inputProps,
    });

    await mkdir(outputDir, { recursive: true });

    const id = uuidv4();
    const outputPath = path.join(outputDir, `${id}.mp4`);

    await renderMedia({
      composition,
      serveUrl: cachedServeUrl,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
    });

    const videoUrl = `/output/${id}.mp4`;
    res.json({ videoUrl });
  } catch (e) {
    console.error('Render error:', e);
    res.status(500).json({
      message: e instanceof Error ? e.message : 'Video render failed',
    });
  }
});

export { router as renderRouter };
