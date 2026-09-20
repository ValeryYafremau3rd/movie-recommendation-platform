"use client";

import { useQuery } from "@tanstack/react-query";

import { getTop100Movies } from "@/api/movies.api";
import MovieGrid from "@/components/movie/MovieGrid";

export default function TopMovies() {
  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movies", "top250"],
    queryFn: getTop100Movies,
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading movies...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        {error instanceof Error ? error.message : "Failed to load movies."}
      </p>
    );
  }

  return <MovieGrid movies={movies} />;
}
