import MovieGrid from "@/components/movie/MovieGrid";
import { Movie } from "@/types/movie";

type StrictSearchResultsProps = {
  movies: Movie[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  fetchNextPage: () => void;
};

export default function StrictSearchResults({
  movies,
  isLoading,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  error,
  fetchNextPage,
}: StrictSearchResultsProps) {
  if (isLoading && movies.length === 0) {
    return <p className="text-sm text-gray-500">Loading movies...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">Failed to load movies.</p>;
  }

  if (movies.length === 0) {
    return <p className="text-sm text-gray-500">No movies found.</p>;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{movies.length} movies</p>

        {isFetching && !isFetchingNextPage && (
          <span className="text-xs text-gray-400">Updating...</span>
        )}
      </div>

      <MovieGrid movies={movies} />

      {hasNextPage && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
