"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchMovie } from "@/api/movies.api";
import MovieDetailsView from "./MovieDetailsView";

type MovieDetailsProps = {
  id: string;
};

export default function MovieDetails({ id }: MovieDetailsProps) {
  const {
    data: movie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id),
    retry: false,
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-gray-500">Loading movie...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Failed to load movie
          </h1>

          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    return null;
  }

  return <MovieDetailsView movie={movie} />;
}
