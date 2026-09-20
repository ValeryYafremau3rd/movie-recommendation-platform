export async function resolveWikipediaTitle(title, requestId) {
	const apiUrl =
		'https://en.wikipedia.org/w/api.php' + '?action=query' + '&redirects=1' + '&format=json' + `&titles=${encodeURIComponent(title)}`;

	const response = await fetch(apiUrl, {
		headers: {
			'User-Agent': USER_AGENT,
		},
	});

	if (!response.ok) {
		return {
			title,
			url: null,
		};
	}

	const data = await response.json();

	const pages = data?.query?.pages;

	if (!pages) {
		return {
			title,
			url: null,
		};
	}

	const page = Object.values(pages)[0];

	if (!page || page.missing !== undefined) {
		throw new Error(`Wikipedia page not found: ${title}`);
	}

	const resolvedTitle = page.title || title;

	return {
		title: resolvedTitle,
		url: `https://en.wikipedia.org/wiki/` + encodeURIComponent(resolvedTitle.replace(/ /g, '_')),
	};
}

export function getWikipediaTitle(url) {
	const match = url.match(/^https:\/\/en\.wikipedia\.org\/wiki\/(.+)$/i);

	if (!match) {
		throw new Error(`Invalid Wikipedia URL: ${url}`);
	}

	return decodeURIComponent(match[1]).replace(/_/g, ' ');
}
