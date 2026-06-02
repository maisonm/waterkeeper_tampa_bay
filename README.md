# Tampa Bay Water Quality Dashboard

A web application for tracking and visualizing current and historical water quality samples collected from sites across Tampa Bay. Data is provided by [Tampa Bay Waterkeeper](https://www.tampabaywaterkeeper.org). The weather API used to pull historical weather data to coincide with water quality site samples is provided by [Open-Meteo](https://open-meteo.com/en/docs/historical-weather-api)

## Overview

Tampa Bay Waterkeeper collects water quality samples at monitoring sites throughout the bay. This dashboard ingests that public data and presents it through interactive charts, a filterable sample table, and a live map of sampling locations — giving researchers, advocates, and the public a clear view of water health trends over time.

## Tech Stack

### Backend

- **FastAPI** — REST API with async request handling
- **PostgreSQL** — primary data store
- **SQLAlchemy** — async ORM
- **Alembic** — database migrations
- **APScheduler** — scheduled syncs (runs Monday and Friday mornings)
- **Open-Meteo** — historical and forecast weather data
- **Pandas** — data ingestion and transformation
- **Gunicorn + Uvicorn** — production ASGI server

### Frontend

- **React 19** with **TypeScript**
- **Vite** — build tooling
- **TanStack Query** — server state and caching
- **React Leaflet** — interactive map
- **AG Grid** — sample data table
- **Highcharts** - sample data visualizations 
- **Tailwind CSS v4** — styling
- **shadcn/ui** — component library

## Data Sync

Sample data is sourced from a Google Sheet maintained by Tampa Bay Waterkeeper and synced automatically twice a week. Weather records are pulled from Open-Meteo on the same schedule. Both sync jobs also run on API startup to ensure the database is current.

## Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `SPREADSHEET_ID` | Google Sheets spreadsheet ID |
| `SHEET_GID` | Target sheet GID within the spreadsheet |
| `ALLOWED_ORIGIN` | Frontend origin for CORS (default: `http://localhost:5173`) |

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

docker compose up -d # run/create the Docker container for the Postgres database
```



### Frontend

```bash
cd frontend/client
npm install
npm run dev
```

### Tests

```bash
# Backend
cd backend
pip install -r requirements-dev.txt
pytest

# Frontend
cd frontend/client
npm test
```

## Production

The app is deployed as a static frontend on **Cloudflare Pages** and a **Railway** API with **Railway PostgreSQL** in the same project. Cloudflare DNS routes your domain to Pages (frontend) and an `api` subdomain to Railway.

| Host | Service |
|------|---------|
| `https://yourdomain.com` | Cloudflare Pages (`frontend/client` build output) |
| `https://api.yourdomain.com` | Railway API ([`backend/Dockerfile`](backend/Dockerfile)) |
| PostgreSQL | Railway Postgres plugin (private; not public) |

### Railway (API + database)

1. Create a Railway project and add a **PostgreSQL** service.
2. Add a second service from this repo:
   - **Root directory:** `backend`
   - **Builder:** Dockerfile (uses [`backend/Dockerfile`](backend/Dockerfile))
   - **Health check path:** `/health`
3. Link Postgres to the API service and set variables (use Railway variable references from the Postgres service where possible):

   | Variable | Notes |
   |----------|--------|
   | `POSTGRES_USER` | From linked Postgres |
   | `POSTGRES_PASSWORD` | From linked Postgres |
   | `POSTGRES_DB` | From linked Postgres |
   | `DB_HOST` | Internal hostname from linked Postgres (not `localhost`) |
   | `SPREADSHEET_ID` | Google Sheet ID |
   | `SHEET_GID` | Sheet tab GID |
   | `ALLOWED_ORIGIN` | Exact frontend URL, e.g. `https://yourdomain.com` |

4. **Release command** (runs before each deploy): `alembic upgrade head`
5. Connect GitHub and enable deploys on push to `main` (after CI passes if you use branch protection).
6. Add a custom domain (e.g. `api.yourdomain.com`) under the API service networking settings.

The container starts Gunicorn on `$PORT` (see [`gunicorn.conf.py`](backend/gunicorn.conf.py)). APScheduler and sync jobs use the same database via `DB_HOST`.

### Cloudflare Pages (frontend)

1. In Cloudflare, create a **Pages** project connected to this GitHub repo.
2. Build settings:

   | Setting | Value |
   |---------|--------|
   | Root directory | `frontend/client` |
   | Build command | `npm ci && npm run build` |
   | Build output directory | `dist` |
   | Production branch | `main` |

3. Environment variable (production):

   | Variable | Value |
   |----------|--------|
   | `VITE_API_URL` | `https://api.yourdomain.com` |

4. Connect the custom domain (`yourdomain.com` / `www`) in Pages; Cloudflare will add DNS records if the zone is on Cloudflare.
5. Enable deploys on push to `main`.

### Domain and DNS

1. Add your domain to Cloudflare (registrar or nameserver change).
2. **Pages:** attach `yourdomain.com` (and optionally `www`) to the Pages project.
3. **API:** create a CNAME record `api` pointing to the Railway-provided host for your API service. Orange-cloud (proxy) is optional; use SSL mode **Full (strict)** if proxied.
4. Confirm `ALLOWED_ORIGIN` on Railway matches the live frontend URL exactly.
5. Smoke test: `GET https://api.yourdomain.com/health` → `{"status":"ok"}`, then load the site and verify API requests in the browser network tab.

### CI/CD

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every pull request and on pushes to `main`:

- **backend:** `pytest` (via `requirements-dev.txt`)
- **frontend:** `lint`, `test`, and production `build`

Configure branch protection on `main` in GitHub to require the `backend` and `frontend` checks before merging. Railway and Cloudflare Pages deploy automatically when `main` is updated after merge.

