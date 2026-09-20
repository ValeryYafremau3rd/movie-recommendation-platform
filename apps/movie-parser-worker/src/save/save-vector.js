import vectorAI from '../../../../packages/ai/ai';
import vectors from '../../../../packages/ai/vectors';
import { truncate } from '../../../../packages/shared/helpers';

export async function saveMovieVector(ai, vector, movie) {
	const text = createMovieEmbeddingText(movie);

	const vector = await vectorAI(ai).createVector(text);

	const metadata = {
		id: movie.id,
		title: String(movie.title || ''),
		wikipedia: String(movie.wikipedia || ''),
		releaseYear: movie.releaseYear ? Number(movie.releaseYear) : null,
		genres: Array.isArray(movie.genres) ? movie.genres : [],
		themes: Array.isArray(movie.themes) ? movie.themes : [],
		director: String(movie.director || ''),
		poster: String(movie.poster || ''),
	};

	try {
		await vectors(env.MOVIES_INDEX).saveVector(movie.id, vector, metadata);

		console.log('Vector upsert successful', id);
	} catch (error) {
		console.error('Vector upsert failed', {
			id,
			error: String(error),
			message: error?.message,
			stack: error?.stack,
		});

		throw error;
	}
}

function createMovieEmbeddingText(movie) {
	const awards = groupMovieAwards(movie.awards);

	const text = [
		`Title: ${truncate(movie.title, 150)}`,
		`Summary: ${truncate(movie.summary, 500)}`,
		`Genres: ${(movie.genres || []).slice(0, 10).join(', ')}`,
		`Themes: ${(movie.themes || []).slice(0, 10).join(', ')}`,
		`Director: ${truncate(movie.director, 100)}`,
		`Writers: ${(movie.writers || []).slice(0, 5).join(', ')}`,
		`Cast: ${(movie.cast || []).slice(0, 10).join(', ')}`,
		`Production companies: ${(movie.productionCompanies || []).slice(0, 5).join(', ')}`,
		`Country: ${(movie.country || []).slice(0, 5).join(', ')}`,
		`Language: ${(movie.language || []).slice(0, 5).join(', ')}`,

		`Awards - Movie: ${awards.movie.join(', ')}`,
		`Awards - Director: ${awards.director.join(', ')}`,
		`Awards - Actor: ${awards.actor.join(', ')}`,
		`Awards - Script: ${awards.script.join(', ')}`,
		`Awards - Music: ${awards.music.join(', ')}`,
		`Awards - Cinematography: ${awards.cinematography.join(', ')}`,
		`Awards - Editing: ${awards.editing.join(', ')}`,
		`Awards - Production design: ${awards.production_design.join(', ')}`,
		`Awards - Visual effects: ${awards.visual_effects.join(', ')}`,
		`Awards - Costume: ${awards.costume.join(', ')}`,
		`Awards - Sound: ${awards.sound.join(', ')}`,
		`Awards - Other: ${awards.other.join(', ')}`,
	]
		.filter(Boolean)
		.join('\n');

	return truncate(text, 2500);
}

function groupMovieAwards(awards) {
	const groups = {
		movie: [],
		director: [],
		actor: [],
		script: [],
		music: [],
		cinematography: [],
		editing: [],
		production_design: [],
		visual_effects: [],
		costume: [],
		sound: [],
		other: [],
	};

	if (!Array.isArray(awards)) {
		return groups;
	}

	for (const award of awards) {
		if (!award || typeof award !== 'object') {
			continue;
		}

		const name = String(award.name || '').trim();

		if (!name) {
			continue;
		}

		const category = groups[award.category] ? award.category : 'other';

		const result = award.result ? 'winner' : 'nominated';

		groups[category].push(`${name} (${result})`);
	}

	for (const category of Object.keys(groups)) {
		groups[category] = [...new Set(groups[category])];
	}

	return groups;
}
