import { normalizeLabel } from '../../../../../packages/shared/helpers';
import { getCleanElementText } from '../../../../../packages/shared/parsers';
import { buildTableGrid } from './movie-table';
import { cleanAwardCategory, cleanAwardName, uniqueAwards } from './cleaner';

export function parseAwardsTables(document) {
	const awards = [];

	const tables = [...document.querySelectorAll('table')];

	console.log(`AWARDS: found ${tables.length} tables`);

	for (const table of tables) {
		const rows = [...table.querySelectorAll('tr')];

		if (!rows.length) {
			continue;
		}

		const headerIndex = rows.findIndex((row) => {
			const headers = [...row.querySelectorAll(':scope > th, :scope > td')].map((cell) => normalizeLabel(getCleanElementText(cell)));

			return headers.includes('award') && headers.includes('category') && headers.includes('result');
		});

		if (headerIndex === -1) {
			continue;
		}

		const headerRow = rows[headerIndex];

		const headers = [...headerRow.querySelectorAll(':scope > th, :scope > td')].map((cell) => normalizeLabel(getCleanElementText(cell)));

		console.log('AWARDS HEADERS:', headers);

		const awardIndex = headers.indexOf('award');
		const categoryIndex = headers.indexOf('category');
		const resultIndex = headers.indexOf('result');

		if (awardIndex === -1 || categoryIndex === -1 || resultIndex === -1) {
			continue;
		}

		const grid = buildTableGrid(rows.slice(headerIndex + 1));

		let currentAward = '';

		for (const logicalRow of grid) {
			if (!logicalRow?.length) {
				continue;
			}

			const awardCell = logicalRow[awardIndex];

			if (awardCell) {
				const awardText = cleanAwardName(getCleanElementText(awardCell));

				if (awardText) {
					currentAward = awardText;

					console.log('AWARD:', currentAward);
				}
			}

			if (!currentAward) {
				continue;
			}

			const categoryCell = logicalRow[categoryIndex];

			const categoryText = categoryCell ? getCleanElementText(categoryCell) : '';

			const category = cleanAwardCategory(categoryText);

			if (!category) {
				continue;
			}

			const resultCell = logicalRow[resultIndex];

			const resultText = resultCell ? getCleanElementText(resultCell) : '';

			const result = parseAwardResult(resultText);

			if (result === null) {
				continue;
			}

			awards.push({
				name: currentAward,
				category,
				result,
			});
		}
	}

	return uniqueAwards(awards);
}
