export default function parseCategories(document) {
	const result = [];

	const links = document.querySelectorAll('#mw-normal-catlinks a');

	for (const link of links) {
		const value = getCleanElementText(link);

		if (value) {
			result.push(value);
		}
	}

	return unique(result);
}
