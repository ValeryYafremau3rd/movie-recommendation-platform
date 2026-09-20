export default `
	SELECT
		m.id,
		m.title,
		m.poster,
		m.release_year,
		SUM(
			CASE
				WHEN ma.result = 1
					AND (
						LOWER(a.name) LIKE '%academy awards%'
						OR LOWER(a.name) LIKE '%academy award%'
						OR LOWER(a.name) LIKE '%oscar%'
						OR LOWER(a.name) LIKE '%golden globe%'
						OR LOWER(a.name) LIKE '%golden globes%'
						OR LOWER(a.name) LIKE '%bafta%'
						OR LOWER(a.name) LIKE '%british academy film awards%'
					)
					THEN 5
				WHEN ma.result = 0
					AND (
						LOWER(a.name) LIKE '%academy awards%'
						OR LOWER(a.name) LIKE '%academy award%'
						OR LOWER(a.name) LIKE '%oscar%'
						OR LOWER(a.name) LIKE '%golden globe%'
						OR LOWER(a.name) LIKE '%golden globes%'
						OR LOWER(a.name) LIKE '%bafta%'
						OR LOWER(a.name) LIKE '%british academy film awards%'
					)
					THEN 3
				WHEN ma.result = 1
					THEN 1
				ELSE 0
			END
		) AS award_score,
		SUM(
			CASE
				WHEN ma.result = 1 THEN 1
				ELSE 0
			END
		) AS wins,
		SUM(
			CASE
				WHEN ma.result = 0 THEN 1
				ELSE 0
			END
		) AS nominations
	FROM movies m
	JOIN movie_awards ma
		ON ma.movie_id = m.id
	JOIN awards a
		ON a.id = ma.award_id
	WHERE EXISTS (
		SELECT 1
		FROM movie_writers mw
		WHERE mw.movie_id = m.id
	)
	GROUP BY
		m.id,
		m.title,
		m.poster,
		m.release_year
	HAVING COUNT(ma.award_id) >= 1
	ORDER BY
		award_score DESC,
		wins DESC,
		nominations DESC,
		m.title ASC
	LIMIT ?
`;
