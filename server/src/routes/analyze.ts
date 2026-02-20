import { Router } from 'express';
import Firecrawl from '@mendable/firecrawl-js';

const router = Router();

router.post('/', async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url || typeof url !== 'string') {
    res.status(400).json({ message: 'Missing or invalid url' });
    return;
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey?.trim()) {
    res.status(500).json({
      message: 'FIRECRAWL_API_KEY is not set. Add it to your environment.',
    });
    return;
  }

  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const firecrawl = new Firecrawl({ apiKey: apiKey.trim() });

  const scrapeOptions = { formats: ['markdown'] as ('markdown' | 'html')[] };
  type ScrapeResult = {
    success?: boolean;
    error?: string;
    markdown?: string;
    metadata?: { title?: string; description?: string; ogImage?: string };
    title?: string;
    description?: string;
  };

  try {
    let scrapeResult: ScrapeResult;
    try {
      scrapeResult = await firecrawl.scrapeUrl(normalizedUrl, scrapeOptions) as ScrapeResult;
    } catch (firstErr: unknown) {
      const status = (firstErr as { statusCode?: number }).statusCode;
      if (status === 502 || status === 503) {
        await new Promise((r) => setTimeout(r, 2000));
        scrapeResult = await firecrawl.scrapeUrl(normalizedUrl, scrapeOptions) as ScrapeResult;
      } else {
        throw firstErr;
      }
    }

    if (!scrapeResult || !scrapeResult.success) {
      res.status(502).json({
        message: scrapeResult?.error || 'Failed to scrape URL',
      });
      return;
    }

    const title = scrapeResult.metadata?.title ?? scrapeResult.title ?? '';
    const description = scrapeResult.metadata?.description ?? scrapeResult.description ?? '';
    const markdown = scrapeResult.markdown ?? '';
    const image = scrapeResult.metadata?.ogImage;

    res.json({
      url: normalizedUrl,
      title: title || new URL(normalizedUrl).hostname,
      description,
      markdown: markdown.slice(0, 2000),
      image: image || undefined,
    });
  } catch (e: unknown) {
    console.error('Analyze error:', e);
    const err = e as { statusCode?: number; message?: string };
    if (err.statusCode === 401) {
      res.status(401).json({
        message: 'Invalid Firecrawl API key. Check FIRECRAWL_API_KEY in server/.env',
      });
      return;
    }
    if (err.statusCode === 502 || err.statusCode === 503) {
      res.status(502).json({
        message: 'Scraper is temporarily unavailable or the page could not be reached. Try again in a moment or use a different URL.',
      });
      return;
    }
    if (err.statusCode === 429) {
      res.status(429).json({
        message: 'Too many requests. Please wait a minute and try again.',
      });
      return;
    }
    res.status(500).json({
      message: err?.message ?? 'Analysis failed',
    });
  }
});

export { router as analyzeRouter };
