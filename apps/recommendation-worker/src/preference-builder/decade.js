export function buildDecadePreferences(movies, likedSet, dislikedSet) {
	const groups = new Map();

	for (const movie of movies) {
		const year = Number(movie.release_year);

		if (!Number.isFinite(year)) {
			continue;
		}

		const decadeStart = Math.floor(year / 10) * 10;

		const name = `${decadeStart}s`;

		if (!groups.has(name)) {
			groups.set(name, {
				name,
				count: 0,
				likedCount: 0,
				dislikedCount: 0,
				score: 0,
			});
		}

		const item = groups.get(name);

		item.count++;

		if (likedSet.has(movie.id)) {
			item.likedCount++;
			item.score++;
		}

		if (dislikedSet.has(movie.id)) {
			item.dislikedCount++;
			item.score--;
		}
	}

	return [...groups.values()].sort((a, b) => {
		if (b.score !== a.score) {
			return b.score - a.score;
		}

		return b.count - a.count;
	});
}
