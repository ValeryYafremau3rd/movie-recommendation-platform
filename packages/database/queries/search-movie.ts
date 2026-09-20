export default `
	SELECT
		id,
		title,
		wikipedia,
		summary,
		poster,
		release_year,
		runtime,
		language,
		director,
		created_at,
		updated_at
	FROM movies
	WHERE
		(? = '' OR title LIKE ? OR summary LIKE ?)
		AND (? IS NULL OR release_year >= ?)
		AND (? IS NULL OR release_year <= ?)

		AND (
			? = ''
			OR EXISTS (
				SELECT 1
				FROM movie_actors ma
				WHERE ma.movie_id = movies.id
				AND ma.actor_id = ?
			)
		)

		AND (
			? = ''
			OR EXISTS (
				SELECT 1
				FROM movie_directors md
				WHERE md.movie_id = movies.id
				AND md.director_id = ?
			)
		)

		AND (
			? = ''
			OR EXISTS (
				SELECT 1
				FROM movie_writers mw
				WHERE mw.movie_id = movies.id
				AND mw.writer_id = ?
			)
		)

		AND (
			? = ''
			OR EXISTS (
				SELECT 1
				FROM movie_genres mg
				WHERE mg.movie_id = movies.id
				AND mg.genre_id = ?
			)
		)

		AND (
			? = ''
			OR EXISTS (
				SELECT 1
				FROM movie_production_companies mpc
				WHERE mpc.movie_id = movies.id
				AND mpc.company_id = ?
			)
		)
`;
