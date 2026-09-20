import { unique } from "../../../../../packages/shared/helpers";

export default function parseGenresFromCategories(categories) {
	const genres = [];

	for (const category of categories) {
		const value = category.replace(/_/g, ' ').trim();

		for (const { genre, pattern } of genrePatterns) {
			if (pattern.test(value)) {
				genres.push(genre);
			}
		}
	}

	return unique(genres);
}

const genrePatterns = [
	{ genre: 'Action', pattern: /\baction films?\b/i },
	{ genre: 'Adventure', pattern: /\badventure films?\b/i },
	{
		genre: 'Animation',
		pattern: /\banimated films?\b|\banimation films?\b/i,
	},
	{
		genre: 'Comedy',
		pattern: /\bcomedy films?\b|\bcomed(?:y|ies)\b/i,
	},
	{ genre: 'Crime', pattern: /\bcrime films?\b/i },
	{ genre: 'Documentary', pattern: /\bdocumentary films?\b/i },
	{ genre: 'Drama', pattern: /\bdrama films?\b/i },
	{ genre: 'Fantasy', pattern: /\bfantasy films?\b/i },
	{ genre: 'Horror', pattern: /\bhorror films?\b/i },
	{ genre: 'Mystery', pattern: /\bmystery films?\b/i },
	{
		genre: 'Romance',
		pattern: /\bromance films?\b|\bromantic films?\b/i,
	},
	{
		genre: 'Science fiction',
		pattern: /\bscience fiction (?:films?|action films?|thriller films?|adventure films?)\b/i,
	},
	{ genre: 'Thriller', pattern: /\bthriller films?\b/i },
	{ genre: 'War', pattern: /\bwar films?\b/i },
	{ genre: 'Western', pattern: /\bwestern films?\b/i },
	{ genre: 'Musical', pattern: /\bmusical films?\b/i },
	{
		genre: 'Biographical',
		pattern: /\bbiographical films?\b|\bbiopic\b/i,
	},
	{ genre: 'Heist', pattern: /\bheist films?\b/i },
	{
		genre: 'Psychological',
		pattern: /\bpsychological (?:thriller|drama) films?\b/i,
	},
	{ genre: 'Superhero', pattern: /\bsuperhero films?\b/i },
	{ genre: 'Disaster', pattern: /\bdisaster films?\b/i },
	{
		genre: 'Noir',
		pattern: /\bfilm noir\b|\bnoir films?\b/i,
	},
	{
		genre: 'Neo-noir',
		pattern: /\bneo-noir films?\b/i,
	},
	{
		genre: 'Satire',
		pattern: /\bsatirical films?\b|\bsatire films?\b/i,
	},
	{
		genre: 'Political',
		pattern: /\bpolitical films?\b/i,
	},
	{
		genre: 'Historical',
		pattern: /\bhistorical films?\b/i,
	},
	{
		genre: 'Coming-of-age',
		pattern: /\bcoming-of-age films?\b/i,
	},
	{
		genre: 'Road movie',
		pattern: /\broad films?\b|\broad movies?\b/i,
	},
];
