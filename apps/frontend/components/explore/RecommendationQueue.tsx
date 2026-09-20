"use client";

import { useMovieStore } from "@/store/movieStore";
import MovieCard from "@/components/movie/MovieCard";
import { Movie } from "@/types/movie";

import { useSearchResultsStore } from "@/store/searchResultsStore";
import { useRecommendationSocket } from "@/hooks/useRecommendationSocket";

const MAX_MOVIES = 50;

export default function RecommendationQueue() {
  const liked = useMovieStore((state) => state.liked);
  const disliked = useMovieStore((state) => state.disliked);
  const saved = useMovieStore((state) => state.saved);

  const movies = useSearchResultsStore((state) => state.recommendationMovies);

  const addRecommendationMovies = useSearchResultsStore(
    (state) => state.addRecommendationMovies,
  );

  const { loadingMore, error, requestRecommendations } =
    useRecommendationSocket({
      liked,
      disliked,
      saved,
      onRecommendations: addRecommendationMovies,
    });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recommended Movies
        </h2>

        {movies.length > 0 && (
          <span className="text-sm text-gray-500">{movies.length} movies</span>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {movies.length === 0 && !loadingMore && (
        <p className="mb-6 text-sm text-gray-500">
          {'Click "Load more" to get recommendations.'}
        </p>
      )}

      {loadingMore && movies.length === 0 && (
        <p className="mb-6 text-sm text-gray-500">Finding movies for you...</p>
      )}

      {movies.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {movies.length < MAX_MOVIES && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={requestRecommendations}
            disabled={loadingMore}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMore ? "Finding more..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
