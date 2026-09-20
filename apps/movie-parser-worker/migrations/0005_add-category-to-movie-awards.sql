-- Migration number: 0005 	 2026-08-24T04:14:06.982Z
ALTER TABLE movie_awards
ADD COLUMN category TEXT;

CREATE INDEX IF NOT EXISTS idx_movie_awards_category
ON movie_awards(category);

CREATE INDEX IF NOT EXISTS idx_movie_awards_movie_category
ON movie_awards(movie_id, category);