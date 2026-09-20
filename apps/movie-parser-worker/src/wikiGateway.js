import { responseJSON, responseError } from '../../../packages/shared/response';
import { sleep } from '../../../packages/shared/helpers';
import { parseWikipediaMovie } from './parse';

const DELAY_MS = 500;

export class WikipediaGateway {
	lastPromise = Promise.resolve();

	constructor(state, env) {
		this.state = state;
		this.env = env;
	}

	async fetch(request) {
		const requestId = crypto.randomUUID();
		const requestUrl = new URL(request.url);

		const wikipediaUrl = requestUrl.searchParams.get('url');

		if (!wikipediaUrl) {
			return responseError('Error', 'Missing url parameter', 400);
		}

		const previousPromise = this.lastPromise;

		let resolveCurrent;

		this.lastPromise = new Promise((resolve) => {
			resolveCurrent = resolve;
		});

		try {
			await previousPromise;

			await sleep(DELAY_MS);

			const result = await parseWikipediaMovie(wikipediaUrl, requestId);

			if (!result || !result.movie) {
				throw new Error('Wikipedia parser returned no movie');
			}

			const movie = result.movie;
			movie.wikipedia = result.url || wikipediaUrl;

			return responseJSON({
				success: true,
				url: result.url || wikipediaUrl,
				movie,
			});
		} catch (error) {
			console.error(`[${requestId}] GATEWAY_ERROR`);

			return responseError(`[${requestId}] GATEWAY_ERROR`, error?.message, 500);
		} finally {
			resolveCurrent();
		}
	}
}
