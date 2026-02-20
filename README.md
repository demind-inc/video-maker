# Teaser from URL

Create a short teaser video from any landing page URL. The app uses **Firecrawl** to analyze the page and **Remotion** to render an MP4.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Express
- **Firecrawl:** Scrape URL and extract title, description, markdown, image
- **Remotion:** Server-side render teaser composition to MP4

## Setup

1. **Install dependencies**

   ```bash
   npm install
   cd client && npm install && cd ..
   cd server && npm install && cd ..
   ```

2. **Environment**

   Create `server/.env` and set:

   ```env
   FIRECRAWL_API_KEY=fc-your-api-key
   ```

   Get an API key at [firecrawl.dev](https://firecrawl.dev).

3. **Run**

   From the project root:

   ```bash
   npm run dev
   ```

   This starts:

   - Client: http://localhost:5173
   - Server: http://localhost:3001

   Use the client in the browser. Enter a landing page URL, wait for “Analyzing website” and “Creating video”, then preview and download the MP4.

## UI flow

1. **Input URL** – User pastes a landing page link and clicks “Create teaser”.
2. **Progress** – Step 1: Analyzing website (Firecrawl). Step 2: Creating video (Remotion).
3. **Result** – Video player and “Download MP4” / “Create another”.

## Project layout

- `client/` – Vite + React + Tailwind (screens: InputUrl, Progress, Result).
- `server/` – Express API:
  - `POST /api/analyze` – body `{ url }`, returns scraped data (title, description, image, etc.).
  - `POST /api/render` – body `{ title, description, image? }`, returns `{ videoUrl }`.
- `server/remotion/` – Remotion entry and “Teaser” composition (title, description, image).
- `server/output/` – Rendered MP4s served at `/output/:id.mp4`.

## Build

```bash
npm run build
npm start
```

Set `PORT` and `FIRECRAWL_API_KEY` in the environment when running in production.

## Deploy to Vercel (client + server)

Both the client (Vite SPA) and server (Express + Remotion) deploy as a single Vercel project: the client is served as static files and the server runs as serverless functions.

1. **Install Vercel CLI** (optional): `npm i -g vercel`

2. **From the repo root**, run:
   ```bash
   vercel
   ```
   Or connect the repo in the [Vercel Dashboard](https://vercel.com/new) and deploy.

3. **Environment variables** (Project → Settings → Environment Variables):
   - `FIRECRAWL_API_KEY` – required for `/api/analyze` (get one at [firecrawl.dev](https://firecrawl.dev)).

4. **Notes**
   - **Analyze** (`/api/analyze`) runs as a serverless function and works on Vercel.
   - **Render** (`/api/render`) uses Remotion and Chromium. On Vercel it may hit time/memory limits (max 60s on Pro, 10s on Hobby) and Chromium may not be available in the default runtime. For reliable video rendering at scale, consider running the server on [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io) and pointing the client at that API URL.
   - Rendered videos on Vercel are written to `/tmp/output` and served for the duration of the function; for persistent storage you’d need to upload to S3/R2 or Vercel Blob.
