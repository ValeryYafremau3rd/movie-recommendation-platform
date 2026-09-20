import { responseJSON } from '../../../packages/shared/response';

export { RecommendationQueue } from './RecommendationQueue';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		try {
			if (request.method === 'GET' && url.pathname === '/recommendations') {
				return await handleWebSocket(request, env);
			}

			return responseJSON(
				{
					error: 'Not found',
				},
				404,
			);
		} catch (error) {
			console.error('Worker error:', error);

			return responseJSON(
				{
					error: error instanceof Error ? error.message : String(error),
				},
				500,
			);
		}
	},
};

async function handleWebSocket(request, env) {
	const upgrade = request.headers.get('Upgrade');

	if (upgrade !== 'websocket') {
		return responseJSON(
			{
				error: 'Expected WebSocket upgrade',
			},
			426,
		);
	}

	const id = env.RECOMMENDATION_SESSION.idFromName('recommendations');

	const stub = env.RECOMMENDATION_SESSION.get(id);

	return stub.fetch(request);
}

