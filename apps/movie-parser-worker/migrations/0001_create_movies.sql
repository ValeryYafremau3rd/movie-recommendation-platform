CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    wikipedia TEXT NOT NULL UNIQUE,
    summary TEXT,
    release_year INTEGER,
    runtime INTEGER,
    language TEXT,
    director TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);

CREATE INDEX IF NOT EXISTS idx_movies_director ON movies(director);

CREATE TABLE IF NOT EXISTS actors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS directors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS writers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS production_companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS genres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS awards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_actors_actor ON movie_actors(actor_id);

CREATE TABLE IF NOT EXISTS movie_directors (
    movie_id TEXT NOT NULL,
    director_id TEXT NOT NULL,
    PRIMARY KEY (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_directors_director ON movie_directors(director_id);

CREATE TABLE IF NOT EXISTS movie_writers (
    movie_id TEXT NOT NULL,
    writer_id TEXT NOT NULL,
    PRIMARY KEY (movie_id, writer_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (writer_id) REFERENCES writers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_writers_writer ON movie_writers(writer_id);

CREATE TABLE IF NOT EXISTS movie_production_companies (
    movie_id TEXT NOT NULL,
    company_id TEXT NOT NULL,
    PRIMARY KEY (movie_id, company_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES production_companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_companies_company ON movie_production_companies(company_id);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id TEXT NOT NULL,
    genre_id TEXT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_genres_genre ON movie_genres(genre_id);

CREATE TABLE IF NOT EXISTS movie_awards (
    movie_id TEXT NOT NULL,
    award_id TEXT NOT NULL,
    PRIMARY KEY (movie_id, award_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (award_id) REFERENCES awards(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_awards_award ON movie_awards(award_id);