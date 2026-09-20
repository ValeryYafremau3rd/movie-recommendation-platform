const WIKI_PREFIX = '/wiki/';

const LIST_PATTERNS = ['list_of_', 'lists_of_'];

const NON_MOVIE_URL_PATTERNS = [...LIST_PATTERNS, 'filmography', 'american_film', '1968_in_film', '1968_in_'];

const EXCLUDED_WIKIPEDIA_PATTERNS = [...LIST_PATTERNS, 'category:', 'file:', 'template:', 'portal:', 'special:', 'help:', 'wikipedia:'];

const NON_MOVIE_TITLES = ['film', 'films', 'notes', 'references', 'external links'];

export function isNonMovieLink(url: string, title: string) {
	const lowerUrl = url.toLowerCase();

	return (
		NON_MOVIE_URL_PATTERNS.some((pattern) => lowerUrl.includes(WIKI_PREFIX + pattern)) ||
		(lowerUrl.includes(WIKI_PREFIX + 'film') && !lowerUrl.includes('_(film)')) ||
		NON_MOVIE_TITLES.includes(title.toLowerCase())
	);
}

export function isExcludedWikipediaPage(url: string) {
	const lowerUrl = url.toLowerCase();

	return EXCLUDED_WIKIPEDIA_PATTERNS.some((pattern) => lowerUrl.includes(WIKI_PREFIX + pattern));
}
