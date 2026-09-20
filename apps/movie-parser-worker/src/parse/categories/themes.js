import { unique } from '../../../../../packages/shared/helpers';

export default function parseThemesFromCategories(categories) {
	const themes = [];

	for (const category of categories) {
		const value = category.replace(/_/g, ' ').trim();

		const match = value.match(/^Films about (.+)$/i);

		if (match) {
			themes.push(cleanCategoryValue(match[1]));
		}
	}

	return unique(themes);
}

function cleanCategoryValue(value) {
	return String(value || '')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/[.;]+$/, '');
}
