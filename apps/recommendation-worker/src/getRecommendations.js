import { buildPreferenceText } from './preference-builder/text';
import { buildPreferenceProfile } from './preference-builder';

const VECTORIZE_INDEX = 'MOVIES_INDEX';
const EMBEDDING_MODEL = '@cf/baai/bge-small-en-v1.5';
const VECTOR_QUERY_LIMIT = 10;

export async function getRecommendations(env, { liked, disliked, saved, excludedIds = [] }) {
	const excludedIdSet = new Set(
		[...excludedIds, ...liked.map((movie) => movie.id), ...disliked.map((movie) => movie.id), ...saved.map((movie) => movie.id)].slice(
			0,
			80,
		),
	);

	const movieIds = [
		...new Set([...liked.map((movie) => movie.id), ...disliked.map((movie) => movie.id), ...saved.map((movie) => movie.id)]),
	];

	const movies = await getMoviesByIds(env, movieIds);

	const profile = await buildPreferenceProfile(
		env,
		movies,
		liked.map((movie) => movie.id),
		disliked.map((movie) => movie.id),
		saved.map((movie) => movie.id),
	);

	const preferenceText = buildPreferenceText(profile);

	const embeddingResult = await env.AI.run(EMBEDDING_MODEL, {
		text: [preferenceText],
	});

	const embedding = embeddingResult?.data?.[0];

	if (!embedding) {
		throw new Error('Embedding model returned no embedding');
	}

	async function searchVectors(topK) {
		const vectorResult = await env[VECTORIZE_INDEX].query(embedding, {
			topK,
			returnMetadata: true,
			filter: {
				id: {
					$nin: [...excludedIdSet],
				},
			},
		});

		const matches = Array.isArray(vectorResult?.matches) ? vectorResult.matches : [];

		console.log('[RECOMMENDATIONS] Vectorize returned:', matches.length);

		if (!matches.length) {
			return [];
		}

		const ids = [...new Set(matches.map((match) => match.id))];
		const placeholders = ids.map(() => '?').join(',');

		const { results } = await env.DB.prepare(`SELECT id FROM movies WHERE id IN (${placeholders})`)
			.bind(...ids)
			.all();

		const d1Ids = new Set(results.map((movie) => movie.id));

		const staleIds = ids.filter((id) => !d1Ids.has(id));

		if (staleIds.length) {
			await env[VECTORIZE_INDEX].deleteByIds(staleIds);
		}

		const recommendations = [];

		for (const match of matches) {
			if (!d1Ids.has(match.id) || excludedIdSet.has(match.id)) {
				continue;
			}

			const metadata = match.metadata || {};

			recommendations.push({
				id: match.id,
				title: metadata.title || 'Unknown title',
				poster: metadata.poster || undefined,
				year: metadata.year ?? metadata.releaseYear ?? undefined,
				releaseYear: metadata.releaseYear ?? metadata.year ?? undefined,
				director: metadata.director || undefined,
				score: typeof match.score === 'number' ? match.score : undefined,
			});
		}

		return recommendations;
	}

	let recommendations = await searchVectors(VECTOR_QUERY_LIMIT);

	console.log('[RECOMMENDATIONS] First search:', recommendations.length);

	if (recommendations.length === 0) {
		console.log('[RECOMMENDATIONS] No valid recommendations. Searching again...');

		recommendations = await searchVectors(VECTOR_QUERY_LIMIT * 2);

		console.log('[RECOMMENDATIONS] Second search:', recommendations.length);
	}

	return {
		movies: recommendations,
	};
}

async function getMoviesByIds(env, ids) {
	if (!ids.length) {
		return [];
	}

	const uniqueIds = [...new Set(ids)];

	const placeholders = uniqueIds.map(() => '?').join(',');

	const result = await env.DB.prepare(
		`
      SELECT
        id,
        title,
        wikipedia,
        summary,
        release_year,
        runtime,
        language,
        director,
        poster
      FROM movies
      WHERE id IN (${placeholders})
    `,
	)
		.bind(...uniqueIds)
		.all();

	return result.results || [];
}
