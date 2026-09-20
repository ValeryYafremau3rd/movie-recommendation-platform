import WikipediaGateway from './wikiGateway';
export { WikipediaGateway };

export default {
	async queue(batch, env) {
		for (const message of batch.messages) {
			const requestId = crypto.randomUUID();

			try {
				const input = message.body;

				const wikipediaUrl = typeof input === 'string' ? input : input?.url;

				if (!wikipediaUrl) {
					throw new Error('Queue message does not contain a Wikipedia URL');
				}

				const id = env.WIKIPEDIA_GATEWAY.idFromName('global');
				const stub = env.WIKIPEDIA_GATEWAY.get(id);

				const response = await stub.fetch(`https://wikipedia-gateway/?url=${encodeURIComponent(wikipediaUrl)}`);

				if (!response.ok) {
					const body = await response.text();

					throw new Error(`Wikipedia gateway returned ${response.status}: ${body}`);
				}

				const result = await response.json();

				if (!result.success || !result.movie) {
					throw new Error(result.error || 'Wikipedia parser returned no movie');
				}

				const movie = result.movie;

				await saveMovie(env.DB, movie);
				await saveMovieVector(env.AI, movie);

				console.log(`[${requestId}] MOVIE_SAVED ${movie.id}`);

				message.ack();
			} catch (error) {
				console.error(`[${requestId}] QUEUE_ERROR`);
			}
		}
	},
};
