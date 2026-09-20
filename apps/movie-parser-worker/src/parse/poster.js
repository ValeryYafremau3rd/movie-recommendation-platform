export default function parsePoster(document) {
	const image = document.querySelector('.infobox-image img') || document.querySelector('.infobox img');

	if (!image) {
		return '';
	}

	let poster = image.getAttribute('src') || image.getAttribute('data-src') || '';

	if (!poster) {
		return '';
	}

	if (poster.startsWith('//')) {
		poster = `https:${poster}`;
	}

	return poster;
}
