# Tampa Bay Water Quality Dashboard

A web application for tracking and visualizing current and historical water quality samples collected from sites across Tampa Bay. Data is provided by [Tampa Bay Waterkeeper](https://www.tampabaywaterkeeper.org). The weather API used to pull historical weather data to coincide with water quality site samples is provided by [Open-Meteo](https://open-meteo.com/en/docs/historical-weather-api)

## Overview

Tampa Bay Waterkeeper collects water quality samples at monitoring sites throughout the bay. This dashboard ingests that data and presents it through interactive charts, a filterable sample table, and a live map of sampling locations — giving researchers, advocates, and the public a clear view of water health trends over time.

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
```

### Frontend

```bash
cd frontend/client
npm install
npm run dev
```

