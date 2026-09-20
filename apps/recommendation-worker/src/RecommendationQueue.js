import { getRecommendations } from './getRecommendations';

export class RecommendationQueue {
	constructor(state, env) {
		this.state = state;
		this.env = env;

		this.profile = null;
	}

	async fetch(request) {
		if (request.headers.get('Upgrade') !== 'websocket') {
			return new Response('Expected WebSocket', {
				status: 426,
			});
		}

		const pair = new WebSocketPair();

		const [client, server] = Object.values(pair);

		server.accept();

		this.profile = {
			liked: [],
			disliked: [],
			saved: [],

			recommendedMovieIds: new Set(),
		};

		console.log('[WS] Connection opened');

		server.addEventListener('message', async (event) => {
			try {
				const body = JSON.parse(event.data);

				console.log('[WS] Message:', body);

				const { liked, disliked, saved } = body;

				this.profile.liked = liked;
				this.profile.disliked = disliked;
				this.profile.saved = saved;

				const previouslyRecommended = [...this.profile.recommendedMovieIds];

				console.log('[WS] Previously recommended:', previouslyRecommended.length);

				const result = await getRecommendations(this.env, {
					liked,
					disliked,
					saved,

					excludedIds: previouslyRecommended,
				});

				const recommendations = Array.isArray(result?.movies) ? result.movies : [];

				for (const movie of recommendations) {
					if (movie?.id) {
						this.profile.recommendedMovieIds.add(movie.id);
					}
				}

				console.log('[WS] Recommended this request:', recommendations.length);

				server.send(
					JSON.stringify({
						type: 'recommendations',
						...result,
					}),
				);
			} catch (error) {
				console.error('[WS] Message error:', error);

				server.send(
					JSON.stringify({
						type: 'error',
						error: error instanceof Error ? error.message : String(error),
					}),
				);
			}
		});

		server.addEventListener('close', () => {
			console.log('[WS] Connection closed');

			this.profile = null;
		});

		server.addEventListener('error', (error) => {
			console.error('[WS] WebSocket error:', error);

			this.profile = null;
		});

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}
}
