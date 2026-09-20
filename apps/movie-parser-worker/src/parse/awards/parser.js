import { findAwardsLink, fetchDocument } from './fetcher';

export function parseAwardResult(value) {
	const text = normalizeLabel(value);

	if (!text) {
		return null;
	}

	if (text === 'won' || text.includes('won')) {
		return true;
	}

	if (
		text === 'nominated' ||
		text.includes('nominated') ||
		text === 'nominee' ||
		text.includes('nominee') ||
		text.includes('runner-up') ||
		text.includes('runner up') ||
		text === 'lost' ||
		text.includes('lost')
	) {
		return false;
	}
	return null;
}

export async function parseMovieAwards(document, movieUrl) {
	if (!document) {
		console.error('parseMovieAwards: missing document');
		return [];
	}

	let awards = parseAwardsTables(document);

	if (awards.length) {
		console.log(`AWARDS: found ${awards.length} awards on movie page`);

		return awards;
	}

	const awardsUrl = findAwardsLink(document, movieUrl);

	if (!awardsUrl) {
		console.log('AWARDS: no separate awards page found');

		return [];
	}

	console.log('AWARDS: separate page:', awardsUrl);

	try {
		const awardsDocument = await fetchDocument(awardsUrl);

		if (!awardsDocument) {
			return [];
		}

		awards = parseAwardsTables(awardsDocument);

		console.log(`AWARDS: found ${awards.length} awards on separate page`);

		return awards;
	} catch (error) {
		console.error('AWARDS: failed to fetch separate awards page:', error);

		return [];
	}
}
