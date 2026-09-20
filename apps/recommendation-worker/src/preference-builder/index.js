import { buildAwardCategoryPreferences } from './awards';
import { buildDecadePreferences } from './decade';
import { buildRelationPreference } from './relations';

export async function buildPreferenceProfile(env, movies, likedIds, dislikedIds, savedIds) {
	const likedSet = new Set(likedIds);
	const dislikedSet = new Set(dislikedIds);

	const profile = {
		movies: movies.length,
		likedMovies: likedIds.length,
		dislikedMovies: dislikedIds.length,
		savedMovies: savedIds.length,
		directors: [],
		actors: [],
		writers: [],
		productionCompanies: [],
		genres: [],
		themes: [],
		awardNames: [],
		awardCategories: [],
		decades: [],
	};

	profile.directors = await buildRelationPreference(env, movies, likedSet, dislikedSet, 'directors', 'movie_directors', 'director_id');
	profile.actors = await buildRelationPreference(env, movies, likedSet, dislikedSet, 'actors', 'movie_actors', 'actor_id');
	profile.writers = await buildRelationPreference(env, movies, likedSet, dislikedSet, 'writers', 'movie_writers', 'writer_id');
	profile.productionCompanies = await buildRelationPreference(
		env,
		movies,
		likedSet,
		dislikedSet,
		'production_companies',
		'movie_production_companies',
		'company_id',
	);
	profile.genres = await buildRelationPreference(env, movies, likedSet, dislikedSet, 'genres', 'movie_genres', 'genre_id');
	profile.themes = await buildRelationPreference(env, movies, likedSet, dislikedSet, 'themes', 'movie_themes', 'theme_id');
	profile.awardNames = await buildRelationPreference(env, movies, likedSet, dislikedSet, 'awards', 'movie_awards', 'award_id');
	profile.awardCategories = await buildAwardCategoryPreferences(env, movies, likedSet, dislikedSet);
	profile.decades = buildDecadePreferences(movies, likedSet, dislikedSet);

	return profile;
}
