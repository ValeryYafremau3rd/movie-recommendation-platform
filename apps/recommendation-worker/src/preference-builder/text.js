export function buildPreferenceText(profile) {
	const sections = [];

	addPreferenceSection(sections, 'Genres', profile.genres, 5);
	addPreferenceSection(sections, 'Themes', profile.themes, 5);
	addPreferenceSection(sections, 'Directors', profile.directors, 5);
	addPreferenceSection(sections, 'Actors', profile.actors, 10);
	addPreferenceSection(sections, 'Writers', profile.writers, 5);
	addPreferenceSection(sections, 'Award categories', profile.awardCategories, 5);
	addPreferenceSection(sections, 'Award names', profile.awardNames, 3);
	addPreferenceSection(sections, 'Decades', profile.decades, 3);
	addPreferenceSection(sections, 'Production companies', profile.productionCompanies, 3);

	if (!sections.length) {
		return 'No explicit movie preferences are available yet.';
	}

	return sections.join('\n');
}

function addPreferenceSection(sections, title, items, numberOfItems = 5) {
	if (!Array.isArray(items) || !items.length) {
		return;
	}

	const sorted = [...items].sort((a, b) => {
		if ((b.score || 0) !== (a.score || 0)) {
			return (b.score || 0) - (a.score || 0);
		}

		return (b.count || 0) - (a.count || 0);
	});

	const positive = sorted.filter((item) => (item.score || 0) > 0);
	const negative = sorted.filter((item) => (item.score || 0) < 0);
	const firstPriority = positive.slice(0, numberOfItems);
	const secondPriority = []; //positive.slice(numberOfItems, numberOfItems * 2);
	const disliked = negative.slice(0, numberOfItems);

	if (firstPriority.length) {
		sections.push(`${firstPriority.map((item) => item.name).join(', ')}`);
	}

	if (secondPriority.length) {
		sections.push(`${title} - second priority: ${secondPriority.map((item) => item.name).join(', ')}`);
	}

	if (disliked.length) {
		//sections.push(`${title} - disliked: ${disliked.map((item) => item.name).join(', ')}`);
	}
}
