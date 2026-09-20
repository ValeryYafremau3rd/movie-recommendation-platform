export default `
	SELECT
		m.id,
		m.title,
		m.wikipedia,
		m.summary,
		m.poster,
		m.release_year,
		m.runtime,
		m.language,
		m.director,
		m.created_at,
		m.updated_at,
		(
			SELECT json_group_array(
				json_object(
					'id', a.id,
					'name', a.name
				)
			)
			FROM movie_actors ma
			JOIN actors a ON a.id = ma.actor_id
			WHERE ma.movie_id = m.id
		) AS actors,
		(
			SELECT json_group_array(
				json_object(
					'id', d.id,
					'name', d.name
				)
			)
			FROM movie_directors md
			JOIN directors d ON d.id = md.director_id
			WHERE md.movie_id = m.id
		) AS directors,
		(
			SELECT json_group_array(
				json_object(
					'id', w.id,
					'name', w.name
				)
			)
			FROM movie_writers mw
			JOIN writers w ON w.id = mw.writer_id
			WHERE mw.movie_id = m.id
		) AS writers,
		(
			SELECT json_group_array(
				json_object(
					'id', pc.id,
					'name', pc.name
				)
			)
			FROM movie_production_companies mpc
			JOIN production_companies pc
				ON pc.id = mpc.company_id
			WHERE mpc.movie_id = m.id
		) AS productionCompanies,
		(
			SELECT json_group_array(
				json_object(
					'id', g.id,
					'name', g.name
				)
			)
			FROM movie_genres mg
			JOIN genres g ON g.id = mg.genre_id
			WHERE mg.movie_id = m.id
		) AS genres,
		(
			SELECT json_group_array(
				json_object(
					'id', t.id,
					'name', t.name
				)
			)
			FROM movie_themes mt
			JOIN themes t ON t.id = mt.theme_id
			WHERE mt.movie_id = m.id
		) AS themes,
		(
			SELECT json_group_array(
				json_object(
					'id', a.id,
					'name', a.name,
					'category', ma.category,
					'result', ma.result
				)
			)
			FROM movie_awards ma
			JOIN awards a ON a.id = ma.award_id
			WHERE ma.movie_id = m.id
		) AS awards
	FROM movies m
	WHERE m.id = ?
`;