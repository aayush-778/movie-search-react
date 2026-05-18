# Movie Search React App

A production-focused movie discovery app built with React + Vite.

It supports:
- searching movies via TMDB API
- debounced search input for fewer API calls and better UX
- trending movies backed by Appwrite database counts
- responsive UI styled with Tailwind CSS v4

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Appwrite SDK
- react-use (`useDebounce`)
- ESLint (flat config)

## Project Structure

```text
src/
  App.jsx                 # Main page logic: fetch/search/trending orchestration
  appwrite.js             # Appwrite client + trending/search count helpers
  components/
	Search.jsx            # Search input component
	MovieCard.jsx         # Movie card UI
	Spinner.jsx           # Loading indicator
```

## Environment Variables

Create a local `.env` file in the project root.

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3

VITE_APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

Notes:
- Client-side env vars in Vite must start with `VITE_`.
- Never commit secrets; `.env` should stay local.
- Restart the dev server after changing `.env`.

## Appwrite Collection Expectations

The app tracks search trends in a collection with fields used by `src/appwrite.js`:

- `searchTerm` (string)
- `count` (number)
- `movie_id` (number or string)
- `poster_url` (string)

`getTrendingMovies()` currently reads top 5 docs sorted by `count` descending.

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run in development

```bash
npm run dev
```

### 3) Lint

```bash
npm run lint
```

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Deployment

This is a static Vite build. Deploy the generated `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

Generic deployment flow:
1. Set all required `VITE_` environment variables in your hosting platform.
2. Build command: `npm run build`
3. Publish/output directory: `dist`

## Best Practices Used in This Project

- Keep API calls centralized in `App.jsx` and service helpers in `appwrite.js`.
- Debounce user search input before triggering requests.
- Keep UI components small and focused (`Search`, `MovieCard`, `Spinner`).
- Treat network/API calls as fallible: always surface loading and error states.
- Validate env configuration early when debugging deployment issues.

## Troubleshooting

- **`undefined` env vars:** verify key names exactly match code and start with `VITE_`.
- **Trending not shown:** verify Appwrite collection exists and contains documents with valid `count` values.
- **Search not working in production:** confirm TMDB/Appwrite env vars are set in your host dashboard (not only local `.env`).
