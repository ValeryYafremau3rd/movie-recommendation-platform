-- Migration number: 0006 	 2026-08-24T04:17:42.285Z
CREATE TABLE IF NOT EXISTS themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_themes (
    movie_id TEXT NOT NULL,
    theme_id TEXT NOT NULL,

    PRIMARY KEY (movie_id, theme_id),

    FOREIGN KEY (movie_id)
        REFERENCES movies(id)
        ON DELETE CASCADE,

    FOREIGN KEY (theme_id)
        REFERENCES themes(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_movie_themes_theme_id
ON movie_themes(theme_id);