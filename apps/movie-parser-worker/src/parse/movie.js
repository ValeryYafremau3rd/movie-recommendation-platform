import findMovieInfobox from './infobox';
import { parseSummary } from './summary';
import parseCategories from './categories';
import parsePoster from './poster';
import parseGenresFromCategories from './categories/genres';
import parseThemesFromCategories from './categories/themes';
import { MULTI_VALUE_MOVIE_FIELDS, STRING_MOVIE_FIELDS, MAIN_MOVIE_FIELDS } from './movie.const';

export default async function parseMovie(document, movieUrl) {
	const infobox = findMovieInfobox(document);

	if (!infobox) {
		return null;
	}

	const rows = [...infobox.querySelectorAll('tr')];
	const titleElement = infobox.querySelector('.infobox-title, .infobox-above');

	const movie = {
		id: '',
		title: titleElement ? getCleanElementText(titleElement) : '',
		wikipedia: movieUrl || '',
		summary: '',
		poster: '',
		director: '',
		writers: [],
		cast: [],
		producers: [],
		composers: [],
		productionCompanies: [],
		distributedBy: [],
		releaseDate: '',
		releaseYear: '',
		runtime: '',
		country: [],
		language: [],
		filmingLocations: [],
		genres: [],
		themes: [],
		formats: [],
		budget: '',
		boxOffice: '',
		awards: [],
		categories: [],
	};

	for (const row of rows) {
		const th = row.querySelector(':scope > th');
		const td = row.querySelector(':scope > td');

		if (!th || !td) {
			continue;
		}

		const values = getCellValues(td);

		if (!values.length) {
			continue;
		}

		const label = normalizeLabel(getCleanElementText(th));
		const arrayField = MULTI_VALUE_MOVIE_FIELDS[label];
		const stringField = STRING_MOVIE_FIELDS[label];

		if (arrayField) {
			movie[arrayField].push(...values);
		} else if (stringField) {
			movie[stringField] = values.join(', ');
		}
	}

	movie.summary = parseSummary(document);
	movie.poster = parsePoster(document);
	movie.categories = parseCategories(document);
	movie.genres.push(...parseGenresFromCategories(movie.categories));
	movie.themes = parseThemesFromCategories(movie.categories);

	for (const field of MAIN_MOVIE_FIELDS) {
		movie[field] = unique(movie[field]);
	}

	try {
		let awards = await parseMovieAwards(document);

		if (!Array.isArray(awards) || !awards.length) {
			const link = findAwardsPageLink(document);

			if (link) {
				const awardsDocument = await fetchWikipediaDocument(link);
				awards = awardsDocument ? await parseMovieAwards(awardsDocument) : [];
			}
		}

		movie.awards = Array.isArray(awards) ? awards : [];
	} catch (error) {
		console.error('AWARDS: parser failed:');
		movie.awards = [];
	}

	const yearMatch = movie.releaseDate.match(/\b(19|20)\d{2}\b/);

	if (yearMatch) {
		movie.releaseYear = yearMatch[0];
	}

	movie.id = slugify(movie.title);

	return movie;
}

function getCellValues(td) {
	const clone = td.cloneNode(true);

	for (const element of clone.querySelectorAll('style, script, sup.reference, .reference, cite')) {
		element.remove();
	}

	const listItems = clone.querySelectorAll('li');

	if (listItems.length) {
		return unique([...listItems].map((li) => getCleanElementText(li)).filter(Boolean));
	}

	for (const br of clone.querySelectorAll('br')) {
		br.replaceWith('\n');
	}

	return unique(
		String(clone.textContent || '')
			.split(/\n+/)
			.map((value) => cleanText(value))
			.filter(Boolean),
	);
}
