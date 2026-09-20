import d1 from '../../../packages/database/d1';
import kv from '../../../packages/cache/kv';
import { responseJSON, responseError } from '../../../packages/shared/response';

export default {
	async scheduled(controller, env, ctx) {
		try {
			const movies = await d1(env.DB).getAwardedMovies();

			await kv(env.AWARDED_MOVIES_CACHE).putTopMovies(movies);

			return responseJSON({
				movies,
			});
		} catch (error) {
			console.error('WORKER_ERROR:', error?.stack || error);

			return responseError('Internal server error', error?.message || String(error), 500);
		}
	},
	async fetch(request, env, ctx) {
		return new Response('Scheduled worker is running locally!');
	},
};
