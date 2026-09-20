import { normalizeUrl, decodeHtml, cleanText } from '../../../packages/shared/parsers';
import { fetchWikiPage } from '../../../packages/shared/fetches';
import { responseError, responseJSON } from '../../../packages/shared/response';
import { isNonMovieLink, isExcludedWikipediaPage } from './movie-links';
import { parseMovies } from './page-parser';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		const match = url.pathname.match(/^\/scrape\/(\d{4})$/);

		if (!match) {
			return new Response('Not found', {
				status: 404,
			});
		}

		const year = match[1];

		try {
			const wikipediaUrl = `https://en.wikipedia.org/wiki/List_of_American_films_of_${year}`;

			console.log(`SCRAPE_YEAR ${year}`);

			const html = await this.fetchWikiPage(wikipediaUrl);

			const movies = parseMovies(html);

			console.log(`MOVIES_FOUND ${movies.length}`);

			if (movies.length === 0) {
				console.warn(`No movies found for year ${year}`);

				return responseJSON({
					year: Number(year),
					url: wikipediaUrl,
					movies: [],
				});
			}

			for (const movie of movies) {
				await env.MOVIE_PAGE_QUEUE.send({
					year: Number(year),
					title: movie.title,
					url: movie.url,
				});
			}

			return responseJSON({
				year: Number(year),
				url: wikipediaUrl,
				movies,
			});
		} catch (error) {
			console.error(`SCRAPE_ERROR`, error?.stack || error);

			return responseError('Scrape error.', error?.message, 500);
		}
	},
};
