
import { getWikipediaTitle, resolveWikipediaTitle } from './title';
import { parseMovie } from './movie';

const USER_AGENT = 'MovieRecommendationPlatform/1.0 (movie ingestion worker)';

export async function parseWikipediaMovie(wikipediaUrl, requestId) {
	if (!/^https:\/\/en\.wikipedia\.org\/wiki\//i.test(wikipediaUrl)) {
		throw new Error('URL must be an English Wikipedia article');
	}

	const originalTitle = getWikipediaTitle(wikipediaUrl);

	const resolved = await resolveWikipediaTitle(originalTitle, requestId);

	const finalTitle = resolved.title || originalTitle;

	const finalUrl = resolved.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(finalTitle.replace(/ /g, '_'))}`;

	const response = await fetch(finalUrl, {
		headers: {
			'User-Agent': USER_AGENT,
		},
	});

	if (!response.ok) {
		throw new Error(`Wikipedia returned ${response.status}`);
	}

	const html = await response.text();

	const { document } = parseHTML(html);

	const movie = await parseMovie(document, finalUrl);

	if (!movie) {
		throw new Error(`Movie infobox not found: ${finalTitle}`);
	}

	movie.wikipedia = finalUrl;

	return {
		url: finalUrl,
		movie,
	};
}
