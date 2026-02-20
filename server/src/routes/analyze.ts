import { Router } from 'express';
import Firecrawl from '@mendable/firecrawl-js';

const router = Router();
const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY || '' });

router.post('/', async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url || typeof url !== 'string') {
    res.status(400).json({ message: 'Missing or invalid url' });
    return;
  }

  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  if (!process.env.FIRECRAWL_API_KEY) {
    res.status(500).json({
      message: 'FIRECRAWL_API_KEY is not set. Add it to your environment.',
    });
    return;
  }

  try {
    const scrapeResult = await firecrawl.scrape(normalizedUrl, {
      formats: ['markdown'],
    });

    if (!scrapeResult || !scrapeResult.success) {
      res.status(502).json({
        message: scrapeResult?.error || 'Failed to scrape URL',
      });
      return;
    }

    const data = scrapeResult.data as {
      markdown?: string;
      metadata?: { title?: string; description?: string; ogImage?: string };
      title?: string;
      description?: string;
    };
    const title = data.metadata?.title ?? data.title ?? '';
    const description = data.metadata?.description ?? data.description ?? '';
    const markdown = data.markdown ?? '';
    const image = data.metadata?.ogImage;

    res.json({
      url: normalizedUrl,
      title: title || new URL(normalizedUrl).hostname,
      description,
      markdown: markdown.slice(0, 2000),
      image: image || undefined,
    });
  } catch (e) {
    console.error('Analyze error:', e);
    res.status(500).json({
      message: e instanceof Error ? e.message : 'Analysis failed',
    });
  }
});

export { router as analyzeRouter };
