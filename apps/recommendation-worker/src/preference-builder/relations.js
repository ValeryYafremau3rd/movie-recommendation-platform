export async function buildRelationPreference(env, movies, likedSet, dislikedSet, table, relationTable, relationIdColumn) {
	if (!movies.length) {
		return [];
	}

	const movieIds = movies.map((movie) => movie.id);
	const likedIds = [...likedSet].filter((id) => movieIds.includes(id));
	const dislikedIds = [...dislikedSet].filter((id) => movieIds.includes(id));

	const moviePlaceholders = movieIds.map(() => '?').join(',');
	const likedPlaceholders = likedIds.map(() => '?').join(',') || "''";
	const dislikedPlaceholders = dislikedIds.map(() => '?').join(',') || "''";

	const query = `
		SELECT
			entity.id,
			entity.name,
			COUNT(*) AS count,
			SUM(
				CASE
					WHEN relation.movie_id IN (${likedPlaceholders}) THEN 1
					ELSE 0
				END
			) AS likedCount,
			SUM(
				CASE
					WHEN relation.movie_id IN (${dislikedPlaceholders}) THEN 1
					ELSE 0
				END
			) AS dislikedCount,
			SUM(
				CASE
					WHEN relation.movie_id IN (${likedPlaceholders}) THEN 1
					WHEN relation.movie_id IN (${dislikedPlaceholders}) THEN -1
					ELSE 0
				END
			) AS score
		FROM ${relationTable} relation
		JOIN ${table} entity
			ON entity.id = relation.${relationIdColumn}
		WHERE relation.movie_id IN (${moviePlaceholders})
			AND entity.name IS NOT NULL
			AND entity.name != ''
		GROUP BY entity.id, entity.name
		ORDER BY score DESC, count DESC
	`;

	const result = await env.DB.prepare(query)
		.bind(...likedIds, ...dislikedIds, ...likedIds, ...dislikedIds, ...movieIds)
		.all();

	return result.results || [];
}
