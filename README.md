# Folio News

A news reader built with **React** and **Node.js**. Headlines are pulled from RSS feeds into a Postgres database. Readers can browse by category, search, like and bookmark stories, keep private notes, and generate AI summaries.

## Tech stack

| Part     | Tools                                                  |
| -------- | ------------------------------------------------------ |
| Frontend | React 19 (JavaScript), Vite, React Router, plain CSS   |
| Backend  | Node.js, Express 5, JWT auth                           |
| Scraper  | Python, FastAPI, BeautifulSoup (small separate service) |
| Database | PostgreSQL                                             |
| Extras   | Groq API (optional, for AI summaries)                  |

## Quick start

You need **Node.js 20+**, **Python 3.10+** and **Docker** (or any Postgres database).

```bash
# 1. Start the database
docker compose up -d

# 2. Configure the server
cp server/.env.example server/.env      # then edit JWT_SECRET (and GROQ_API_KEY if you want AI summaries)

# 3. Install everything
npm install
npm run setup:scraper                   # installs the Python packages

# 4. Run client + server + scraper together
npm run dev
```

Open **http://localhost:5173**. On first start the server creates the tables and fetches the latest news, then refreshes it every 30 minutes.

## Project structure

```
folio-news/
├── client/                  React app
│   └── src/
│       ├── api/             All calls to the backend (one file per area)
│       ├── components/      Reusable pieces: layout/, articles/, auth/, ui/
│       ├── context/         Global state: login (AuthContext), dark mode (ThemeContext)
│       ├── hooks/           useAsync (data loading), useArticleActions (like/bookmark)
│       ├── pages/           One file per screen
│       ├── styles/          variables.css (colors), base.css, components.css
│       └── utils/           Small helpers (date formatting)
│
├── scraper/                 Python service that extracts article text
│   └── app/
│       ├── main.py          FastAPI endpoints (/scrape, /health)
│       └── scraper.py       Download + parse logic (BeautifulSoup)
│
├── server/                  Express API
│   ├── scripts/sync.js      Manual feed refresh
│   └── src/
│       ├── config/          env.js (settings), db.js (connection), feeds.js (RSS list)
│       ├── routes/          URL → controller mapping
│       ├── controllers/     Handle a request, validate input, send the response
│       ├── models/          All SQL lives here
│       ├── services/        Outside world: rss, scraper (calls the Python service), AI
│       ├── middleware/      auth (JWT), error handling
│       └── db/              schema.sql + migrate.js
│
├── docker-compose.yml       Local Postgres
└── package.json             Workspace root: runs both apps
```

### How a request flows

```
Browser → client/src/api → Express route → controller → model (SQL) → Postgres
                                                  └──→ service (RSS / scraper / AI)
                                                            └──→ Python scraper (HTTP)
```

Each layer has one job, so a new feature usually means: add a model function, a controller function, a route, and an API function + page on the client.

## API

All routes start with `/api`. 🔒 = needs a login token (`Authorization: Bearer <token>`).

| Method | Route                          | Description                                          |
| ------ | ------------------------------ | ---------------------------------------------------- |
| POST   | `/auth/signup`                 | Create an account                                    |
| POST   | `/auth/login`                  | Log in, returns a token                              |
| GET    | `/auth/me` 🔒                  | Current user                                         |
| GET    | `/articles`                    | List articles. Query: `category`, `q`, `sort=trending`, `limit`, `offset` |
| GET    | `/articles/categories`         | Available categories                                 |
| GET    | `/articles/:id`                | One article (full text is scraped on first open)     |
| GET    | `/articles/bookmarks` 🔒       | Your bookmarked articles                             |
| POST   | `/articles/:id/like` 🔒        | Toggle like                                          |
| POST   | `/articles/:id/bookmark` 🔒    | Toggle bookmark                                      |
| POST   | `/articles/:id/summary` 🔒     | AI summary (cached after the first time)             |
| GET/POST | `/articles/:id/notes` 🔒     | List / add your private notes                        |
| DELETE | `/articles/:id/notes/:noteId` 🔒 | Delete a note                                      |

## Useful commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Run client, server and scraper with hot reload |
| `npm run setup:scraper` | Install the scraper's Python packages   |
| `npm run build`   | Build the client for production (`client/dist`) |
| `npm run migrate` | Create / update database tables               |
| `npm run sync`    | Fetch the latest news now                     |

## Configuration

Server settings live in `server/.env` (see `server/.env.example`):

| Variable                | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `DATABASE_URL`          | Postgres connection string                      |
| `DATABASE_SSL`          | `true` for hosted databases that require SSL    |
| `JWT_SECRET`            | Secret used to sign login tokens                |
| `CLIENT_URL`            | Allowed frontend origin (CORS)                  |
| `SCRAPER_URL`           | Where the Python scraper runs (default `http://localhost:8000`) |
| `GROQ_API_KEY`          | Optional, enables AI summaries                  |
| `SYNC_INTERVAL_MINUTES` | How often feeds refresh                         |

To add a news category, add a line to `server/src/config/feeds.js`.

## Deploying

- **Scraper**: any Python host. Run `uvicorn app.main:app --port 8000` inside `scraper/`.
- **Server**: any Node host. Set the env vars above (including `SCRAPER_URL`) and run `npm start -w server`.
- **Client**: run `npm run build`, host the `client/dist` folder on any static host, and set `VITE_API_URL` to your server's `/api` URL before building.

## What changed from v1

- The frontend and backend are plain JavaScript (no TypeScript). The Python scraper stays, rebuilt as a small `scraper/` service that the Node server calls.
- The frontend no longer hardcodes `localhost` URLs; all API calls go through `client/src/api`.
- Real accounts (JWT + hashed passwords) replace the mock login and Clerk. Likes, bookmarks and notes are stored per user in the database instead of the browser.
- Search and Trending now use real data. News is stored in the database and refreshed in the background, not re-fetched on every page view.
- AI summaries are cached, and returned as plain text (no raw HTML injection).
