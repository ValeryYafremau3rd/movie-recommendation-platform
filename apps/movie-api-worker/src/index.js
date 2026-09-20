import { responseCORS, responseError, responseJSON } from '../../../packages/shared/response';
import { encodeCursor, decodeCursor } from '../../../packages/shared/helpers';
import validateSearchParams from '../../../packages/validation/searcv-validator';
import d1 from '../../../packages/database/d1';
import kv from '../../../packages/cache/kv';

const sortFields = {
	id: 'id',
	title: 'title',
	year: 'release_year',
	release_year: 'release_year',
	director: 'director',
	runtime: 'runtime',
	created_at: 'created_at',
	updated_at: 'updated_at',
};

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		try {
			switch (url.pathname) {
				case '/movies':
					return responseJSON(await listMovies(env, url));
				case '/top100':
					return responseCORS(await kv(env.AWARDED_MOVIES_CACHE).getTopMovies());
				case '/actors':
					return responseJSON(await searchEntities(env, 'actors', url));
				case '/writers':
					return responseJSON(await searchEntities(env, 'writers', url));
				case '/companies':
					return responseJSON(await searchEntities(env, 'production_companies', url));
				case '/directors':
					return responseJSON(await searchEntities(env, 'directors', url));
				case '/genres':
					return responseJSON(await searchEntities(env, 'genres', url));
				case '/themes':
					return responseJSON(await searchEntities(env, 'themes', url));
				default:
					if (url.pathname.startsWith('/movies/')) {
						const id = decodeURIComponent(url.pathname.slice('/movies/'.length));

						if (!id) {
							return responseError('Movie ID is required', 'Movie ID is required', 400);
						}

						return responseJSON(await d1(env.DB).getDetailedMovie(id));
					}
			}
		} catch (error) {
			console.error(error);

			return responseError('Internal server error', error.message, 500);
		}
	},
};

async function searchEntities(env, table, url) {
	const search = (url.searchParams.get('search') || '').trim();

	if (!search) {
		return {
			items: [],
		};
	}

	const result = await d1(env.DB).searchEntities(table, search);

	const items = (result.results || []).map((item) => ({
		id: item.id,
		name: item.name,
	}));

	return { items };
}

async function listMovies(env, url) {
	const limit = 20;
	const yearFromParam = url.searchParams.get('yearFrom');
	const yearToParam = url.searchParams.get('yearTo');

	const searchParams = {
		search: (url.searchParams.get('search') || '').trim(),
		actorId: (url.searchParams.get('actorId') || '').trim(),
		directorId: (url.searchParams.get('directorId') || '').trim(),
		writerId: (url.searchParams.get('writerId') || '').trim(),
		genreId: (url.searchParams.get('genreId') || '').trim(),
		companyId: (url.searchParams.get('companyId') || '').trim(),

		yearFrom: yearFromParam !== null && yearFromParam !== '' ? Number(yearFromParam) : null,

		yearTo: yearToParam !== null && yearToParam !== '' ? Number(yearToParam) : null,

		sortField: sortFields[(url.searchParams.get('sort') || 'id').trim()],
		order: (url.searchParams.get('order') || 'asc').trim().toUpperCase(),
	};

	validateSearchParams(searchParams);

	let cursorData = null;
	const cursor = url.searchParams.get('cursor');

	if (cursor) {
		try {
			cursorData = decodeCursor(cursor);
		} catch {
			throw new Error('Invalid cursor');
		}

		if (!cursorData || cursorData.sort !== searchParams.sortField || cursorData.order !== searchParams.order || cursorData.id == null) {
			throw new Error('Invalid cursor');
		}
	}

	const result = await d1(env.DB).moviesQuery(searchParams, cursorData);

	const rows = result.results || [];
	const hasMore = rows.length > limit;

	if (hasMore) {
		rows.pop();
	}

	let nextCursor = null;

	if (hasMore && rows.length > 0) {
		const lastMovie = rows[rows.length - 1];

		nextCursor = encodeCursor({
			sort: searchParams.sortField,
			order: searchParams.order,
			value: lastMovie[searchParams.sortField],
			id: lastMovie.id,
		});
	}

	return {
		movies: rows,
		count: rows.length,
		nextCursor,
	};
}
