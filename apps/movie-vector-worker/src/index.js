import { responseCORS, responseError, responseJSON } from '../../../packages/shared/response';
import AI from '../../../packages/ai/ai';
import Vectors from '../../../packages/ai/vectors';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		try {
			if (url.pathname === '/search') {
				const prompt = (url.searchParams.get('prompt') || '').trim();

				if (!prompt) {
					return responseError('Missing prompt', '', 400);
				}

				const vector = await AI(env.AI).createVector(prompt);

				const matches = await Vectors(env.MOVIES_INDEX).findMatches(vector);

				return responseJSON({
					prompt,
					count: matches.length,
					movies: matches,
				});
			}
			return new responseCORS('movie-search-worker');
		} catch (error) {
			console.error(error);

			return responseError('Internal server error', error.message, 500);
		}
	},
};
