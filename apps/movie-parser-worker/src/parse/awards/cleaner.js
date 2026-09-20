const AWARD_CATEGORIES = {
	actor: ['actor', 'actress', 'performance'],
	director: ['director', 'directing'],
	script: ['screenplay', 'screenwriting', 'script'],
	cinematography: ['cinematography', 'camera'],
	editing: ['editing', 'film editing'],
	sound: ['sound', 'sound mixing', 'sound editing'],
	music: ['music', 'original score', 'song'],
	visual_effects: ['visual effects', 'special effects'],
	production_design: ['production design', 'art direction'],
	costume: ['costume', 'costumes'],
	makeup: ['make-up', 'makeup', 'hair'],
};

export function cleanAwardCategory(value) {
	const text = String(value || '')
		.replace(/\[[^\]]*\]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	if (!text) {
		return '';
	}

	const normalized = normalizeLabel(text);

	return Object.entries(AWARD_CATEGORIES).find(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))?.[0] || 'other';
}

export function uniqueAwards(awards) {
	const seen = new Set();

	return awards.filter((award) => {
		const key = [award.name, award.category, award.result].join('|');

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);

		return true;
	});
}

export function cleanAwardName(value) {
	return String(value || '')
		.replace(/\[[^\]]*\]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}
