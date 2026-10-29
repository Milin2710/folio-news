CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  link        TEXT NOT NULL UNIQUE,
  thumbnail   TEXT,
  category    TEXT NOT NULL,
  pub_date    TIMESTAMPTZ,
  content     TEXT,   -- full text, scraped the first time an article is opened
  summary     TEXT,   -- AI summary, generated on demand and cached
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_pub_date ON articles (pub_date DESC);

CREATE TABLE IF NOT EXISTS likes (
  user_id    INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  article_id INT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id    INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  article_id INT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS notes (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  article_id INT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user_article ON notes (user_id, article_id);
