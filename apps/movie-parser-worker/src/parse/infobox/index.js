export default function findMovieInfobox(document) {
	const infobox = document.querySelector('table.infobox');

	if (infobox) {
		return infobox;
	}

	const tables = [...document.querySelectorAll('table')];

	const movieFields = [
		'directed by',
		'written by',
		'screenplay by',
		'starring',
		'production companies',
		'produced by',
		'cinematography',
		'editing',
		'music by',
		'running time',
		'country',
		'language',
	];

	for (const table of tables) {
		const rows = [...table.querySelectorAll('tr')];

		let score = 0;

		for (const row of rows) {
			const th = row.querySelector(':scope > th');

			if (!th) {
				continue;
			}

			const label = normalizeLabel(getCleanElementText(th));

			if (movieFields.includes(label)) {
				score++;
			}
		}

		if (score >= 2) {
			return table;
		}
	}

	return null;
}
