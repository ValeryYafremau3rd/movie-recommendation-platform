import { decodeHtml, cleanText, normalizeUrl } from '../../../packages/shared/parsers';
import { isExcludedWikipediaPage, isNonMovieLink } from './movie-links';

const ROW_REGEX = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const CELL_REGEX = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
const ANCHOR_REGEX = /<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi;
const TITLE_REGEX = /\btitle="([^"]+)"/i;
const WIKIPEDIA_URL_REGEX = /^https:\/\/en\.wikipedia\.org\/wiki\//i;
const WIKIPEDIA_PATH = '/wiki/';
const WIKIPEDIA_HOST = 'https://en.wikipedia.org';

export function parseMovies(html: string) {
	const movies = [];
	const seen = new Set();

	for (const rowMatch of html.matchAll(ROW_REGEX)) {
		const cells = [...rowMatch[1].matchAll(CELL_REGEX)];

		if (!cells.length) {
			continue;
		}

		let movie;

		for (const cellMatch of cells) {
			for (const anchor of cellMatch[1].matchAll(ANCHOR_REGEX)) {
				let url = decodeHtml(anchor[2]).replace(/\\_/g, '_').replace(/\\\(/g, '(').replace(/\\\)/g, ')').replace(/\\'/g, "'");

				if (url.startsWith(WIKIPEDIA_PATH)) {
					url = `${WIKIPEDIA_HOST}${url}`;
				}

				if (!WIKIPEDIA_URL_REGEX.test(url) || isExcludedWikipediaPage(url)) {
					continue;
				}

				const attributes = (anchor[1] || '') + (anchor[3] || '');
				const titleMatch = attributes.match(TITLE_REGEX);
				const title = titleMatch ? decodeHtml(titleMatch[1]).trim() : cleanText(anchor[4]);

				if (!title || isNonMovieLink(url, title) || seen.has(normalizeUrl(url))) {
					continue;
				}

				movie = { title, url };
				break;
			}

			if (movie) {
				break;
			}
		}

		if (movie) {
			seen.add(normalizeUrl(movie.url));
			movies.push(movie);
		}
	}

	return movies;
}
