"use client";

import MovieGrid from "@/components/movie/MovieGrid";
import { useMovieStore } from "@/store/movieStore";

export default function DislikedMovies() {
  const disliked = useMovieStore((state) => state.disliked);

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Disliked Movies
      </h2>

      <MovieGrid movies={disliked} />
    </section>
  );
}
