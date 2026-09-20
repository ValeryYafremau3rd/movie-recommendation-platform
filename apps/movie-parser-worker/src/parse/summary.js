export function parseSummary(document) {
	const paragraphs = [...document.querySelectorAll('.mw-parser-output p')];

	for (const paragraph of paragraphs) {
		const text = getCleanElementText(paragraph);

		if (text.length > 40) {
			return text;
		}
	}

	return '';
}
