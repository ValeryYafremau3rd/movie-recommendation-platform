import { toText } from '../../../../packages/shared/parsers';
import d1 from '../../../../packages/database/d1';

export async function saveMovie(db, movie) {
	const language = toText(movie.language);
	const releaseYear = movie.releaseYear == null || movie.releaseYear === '' ? null : Number.parseInt(movie.releaseYear, 10) || null;
	const runtimeMatch = String(movie.runtime || '').match(/\d+/);
	const runtime = runtimeMatch ? Number.parseInt(runtimeMatch[0], 10) : null;

	await d1(db).saveMovie(movie, releaseYear, runtime, language);
	await d1(db).replaceMovieEntities('actors', 'movie_actors', 'actor_id', movie.cast, movie.id);
	await d1(db).replaceMovieEntities('directors', 'movie_directors', 'director_id', movie.director ? [movie.director] : [], movie.id);
	await d1(db).replaceMovieEntities('writers', 'movie_writers', 'writer_id', movie.writers, movie.id);
	await d1(db).replaceMovieEntities('genres', 'movie_genres', 'genre_id', movie.genres, movie.id);
	await d1(db).replaceMovieEntities('themes', 'movie_themes', 'theme_id', movie.themes, movie.id);
	await d1(db).replaceMovieEntities(
		'production_companies',
		'movie_production_companies',
		'company_id',
		movie.productionCompanies,
		movie.id,
	);
	await d1(db).replaceMovieAwards(movie.awards, movie.id);
}

