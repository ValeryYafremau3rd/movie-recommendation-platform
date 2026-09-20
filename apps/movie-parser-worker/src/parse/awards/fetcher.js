export async function fetchDocument(url) {
	const response = await fetch(url, {
		headers: {
			'User-Agent': 'MovieRecommendationBot/1.0',
		},
	});

	if (!response.ok) {
		throw new Error(`Wikipedia returned ${response.status}`);
	}

	const html = await response.text();

	return parseHTML(html).document;
}

export function findAwardsLink(document, movieUrl) {
	const links = [...document.querySelectorAll('a[href]')];

	for (const link of links) {
		const text = getCleanElementText(link);

		const href = link.getAttribute('href');

		if (!href) {
			continue;
		}

		const normalizedText = normalizeLabel(text);

		const normalizedHref = normalizeLabel(href);

		if (
			normalizedText.includes('accolades') ||
			normalizedText.includes('awards and nominations') ||
			normalizedText.includes('awards and nominations received') ||
			normalizedHref.includes('list_of_accolades_received_by') ||
			normalizedHref.includes('list_of_awards_and_nominations')
		) {
			return new URL(href, movieUrl).href;
		}
	}

	return null;
}
