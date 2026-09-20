-- Migration number: 0003 	 2026-08-17T13:32:41.641Z
CREATE INDEX IF NOT EXISTS idx_movies_title
ON movies(title);

CREATE INDEX IF NOT EXISTS idx_movies_release_year
ON movies(release_year);

CREATE INDEX IF NOT EXISTS idx_movies_director
ON movies(director);

CREATE INDEX IF NOT EXISTS idx_movie_genres_movie
ON movie_genres(movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_genres_genre
ON movie_genres(genre_id);

CREATE INDEX IF NOT EXISTS idx_movie_actors_movie
ON movie_actors(movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_actors_actor
ON movie_actors(actor_id);

CREATE INDEX IF NOT EXISTS idx_movie_writers_movie
ON movie_writers(movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_writers_writer
ON movie_writers(writer_id);

CREATE INDEX IF NOT EXISTS idx_movie_companies_movie
ON movie_production_companies(movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_companies_company
ON movie_production_companies(company_id);

CREATE INDEX IF NOT EXISTS idx_movie_awards_movie
ON movie_awards(movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_awards_award
ON movie_awards(award_id);