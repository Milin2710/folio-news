# Folio News

A news reader. Headlines come from BBC RSS feeds and are stored in Postgres. Readers can browse by category, search, like and bookmark stories, keep private notes, and generate AI summaries.

## How it fits together

The project has **3 folders**, and each one runs on its own:

| Folder     | What it is                   | Runs on               | Job                                                                 |
| ---------- | ---------------------------- | --------------------- | ------------------------------------------------------------------- |
| `client/`  | React (JavaScript) + Vite    | http://localhost:5173 | The website                                                         |
| `server/`  | Node.js + Express + Postgres | http://localhost:4000 | API, login, saves everything to the database, fetches the RSS feeds |
| `scraper/` | Python + FastAPI             | http://localhost:8000 | Fetches the **full text** of an article when someone opens it       |

```
Browser → client → server → Postgres
                     └────→ scraper (only when an article is opened)
```

The scraper is optional for browsing. Without it, the site works but articles show only the short RSS description instead of the full text.

## 1. Requirements

- **Node.js 20+** (`node -v`)
- **Python 3.10+** (`python --version`)
- **PostgreSQL 14+**, via Docker or installed directly (step 2)

## 2. Set up the database

Pick **one** option.

### Option A: Docker

```bash
docker compose up -d
```

Your `DATABASE_URL` is then `postgres://folio:folio@localhost:5432/folio`.

### Option B: No Docker, install Postgres

```bash
# Windows (PowerShell)
winget install PostgreSQL.PostgreSQL.16

# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu / Debian
sudo apt update && sudo apt install -y postgresql
sudo service postgresql start
```

Create an empty database called `folio`:

```bash
# Windows / macOS (psql must be on your PATH, or use pgAdmin)
createdb -U postgres folio

# Ubuntu / Debian
sudo -u postgres createdb folio
```

Your `DATABASE_URL` is then `postgres://postgres:YOUR_PASSWORD@localhost:5432/folio` (the password you chose when installing).

### Option C: Free hosted Postgres

Create a database on [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy its connection string. Set `DATABASE_SSL=true` in the next step.

## 3. Configure the server

```bash
cd server
cp .env.example .env          # Windows PowerShell: copy .env.example .env
```

Open `server/.env` and set:

| Variable       | What to put                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| `DATABASE_URL` | The URL from step 2                                                                      |
| `DATABASE_SSL` | `false` for local Postgres, `true` for Neon / Supabase                                   |
| `JWT_SECRET`   | Any long random text                                                                     |
| `GROQ_API_KEY` | Optional. Get one at [console.groq.com](https://console.groq.com) to enable AI summaries |

Everything else has a working default. The server creates the database tables by itself on first start.

## 4. Install dependencies

Run these once, from the project root (`folio-news/`):

```bash
# Node packages for client + server (one command installs both)
npm install

# Python packages for the scraper
cd scraper
pip install -r requirements.txt
cd ..
```

Prefer an isolated Python environment? Do this instead of the plain `pip install`:

```bash
cd scraper
python -m venv venv
venv\Scripts\activate            # macOS / Linux: source venv/bin/activate
pip install -r requirements.txt
cd ..
```

Use `python3` / `pip3` if that is what your machine calls them. If you use the virtual environment, activate it in the terminal that runs the scraper.

## 5. Run the app

### Recommended: 3 terminals, one per folder

Open three terminals, all starting in the project root.

**Terminal 1: server**

```bash
cd server
npm run dev
```

You should see `API running at http://localhost:4000/api`.

**Terminal 2: client**

```bash
cd client
npm run dev
```

**Terminal 3: scraper**

```bash
cd scraper
python -m uvicorn app.main:app --port 8000 --reload
```

You should see `Uvicorn running on http://127.0.0.1:8000`.

> Run uvicorn from inside `scraper/`. `python app/main.py` will not work.

### Shortcut: one command

From the project root, this starts all three together:

```bash
npm run dev
```

It runs the scraper with `python3`. If your machine only has `python` (common on Windows), use the 3-terminal method instead.

## 6. Check that it works

| Open                             | You should see             |
| -------------------------------- | -------------------------- |
| http://localhost:5173            | The website with headlines |
| http://localhost:4000/api/health | `{"status":"ok"}`          |
| http://localhost:8000/health     | `{"status":"ok"}`          |

Headlines appear a few seconds after the first server start, once the RSS feeds have been fetched. To fetch them right now, run `npm run sync` from the project root.

## Commands cheat sheet

| Where      | Command                                               | What it does                     |
| ---------- | ----------------------------------------------------- | -------------------------------- |
| root       | `npm install`                                         | Install client + server packages |
| `scraper/` | `pip install -r requirements.txt`                     | Install scraper packages         |
| `server/`  | `npm run dev`                                         | Start the API (auto-restarts)    |
| `client/`  | `npm run dev`                                         | Start the website                |
| `scraper/` | `python -m uvicorn app.main:app --port 8000 --reload` | Start the scraper                |
| root       | `npm run dev`                                         | Start all three at once          |
| root       | `npm run sync`                                        | Fetch the latest news now        |
| root       | `npm run build`                                       | Build the client for production  |

## Troubleshooting

- **Blank page:** open the browser console (F12) and check for errors. Also confirm the server terminal says `API running`.
- **No articles:** wait a few seconds after the first start, or run `npm run sync`. The sandbox or network must be able to reach `feeds.bbci.co.uk`.
- **Articles show only a short text:** the scraper isn't running, or it can't reach the BBC page.
- **`ECONNREFUSED` on port 5432:** Postgres isn't running, or `DATABASE_URL` is wrong.
- **SSL warning about `sslmode=require`:** harmless. Change it to `sslmode=verify-full` in `DATABASE_URL` to silence it.
- **`Missing required environment variable`:** you haven't created `server/.env` yet (step 3).

## Project structure

```
folio-news/
├── client/                React app
│   └── src/
│       ├── api/           All calls to the server
│       ├── components/    layout/, articles/, auth/, ui/
│       ├── context/       Login state, dark mode
│       ├── hooks/         Data loading, like/bookmark logic
│       ├── pages/         One file per screen
│       └── styles/        Colors (variables.css) and styling
├── server/
│   └── src/
│       ├── config/        Settings, database connection, RSS feed list
│       ├── routes/        URL → controller
│       ├── controllers/   Validate the request, send the response
│       ├── models/        All SQL queries
│       ├── services/      RSS sync, scraper client, AI summaries
│       ├── middleware/    Login check, error handling
│       └── db/            schema.sql + migrate.js
├── scraper/
│   └── app/               main.py (endpoints), scraper.py (parsing)
├── docker-compose.yml     Optional local Postgres
└── package.json           Root scripts
```

To add a news category, add one line to `server/src/config/feeds.js`.

## API

All routes start with `/api`. 🔒 means you must be logged in.

| Method     | Route                            | Description                                                       |
| ---------- | -------------------------------- | ----------------------------------------------------------------- |
| POST       | `/auth/signup`, `/auth/login`    | Create an account / log in (returns a token)                      |
| GET        | `/auth/me` 🔒                    | Current user                                                      |
| GET        | `/articles`                      | List articles. Options: `category`, `q`, `sort=trending`, `limit` |
| GET        | `/articles/categories`           | Available categories                                              |
| GET        | `/articles/:id`                  | One article (full text is fetched on first open)                  |
| GET        | `/articles/bookmarks` 🔒         | Your bookmarks                                                    |
| POST       | `/articles/:id/like` 🔒          | Toggle like                                                       |
| POST       | `/articles/:id/bookmark` 🔒      | Toggle bookmark                                                   |
| POST       | `/articles/:id/summary` 🔒       | AI summary (saved after the first time)                           |
| GET / POST | `/articles/:id/notes` 🔒         | List / add your private notes                                     |
| DELETE     | `/articles/:id/notes/:noteId` 🔒 | Delete a note                                                     |

## Deploying

- **Scraper:** any Python host, run `uvicorn app.main:app --port 8000` inside `scraper/`.
- **Server:** any Node host, set the `.env` values (including `SCRAPER_URL`) and run `npm start -w server`.
- **Client:** run `npm run build`, host `client/dist` on any static host, and set `VITE_API_URL` to your server's `/api` URL before building.
