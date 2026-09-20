export async function buildAwardCategoryPreferences(env, movies, likedSet, dislikedSet) {
	const movieIds = movies.map((movie) => movie.id);

	if (!movieIds.length) {
		return [];
	}

	const placeholders = movieIds.map(() => '?').join(', ');

	const likedIds = [...likedSet].filter((id) => movieIds.includes(id));
	const dislikedIds = [...dislikedSet].filter((id) => movieIds.includes(id));

	const likedPlaceholders = likedIds.map(() => '?').join(', ') || "''";
	const dislikedPlaceholders = dislikedIds.map(() => '?').join(', ') || "''";

	const result = await env.DB.prepare(
		`
			SELECT
				ma.category AS name,
				SUM(
					CASE
						WHEN ma.movie_id IN (${likedPlaceholders}) THEN 1
						WHEN ma.movie_id IN (${dislikedPlaceholders}) THEN -1
						ELSE 0
					END
				) AS score,
				COUNT(*) AS count
			FROM movie_awards ma
			WHERE ma.movie_id IN (${placeholders})
				AND ma.category IS NOT NULL
				AND ma.category != ''
			GROUP BY ma.category
			ORDER BY score DESC, count DESC
		`,
	)
		.bind(...likedIds, ...dislikedIds, ...movieIds)
		.all();

	return result.results || [];
}
