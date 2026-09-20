"use client";

import MovieGrid from "@/components/movie/MovieGrid";
import { useMovieStore } from "@/store/movieStore";

export default function SavedMovies() {
  const saved = useMovieStore((state) => state.saved);

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Saved Movies</h2>

      <MovieGrid movies={saved} />
    </section>
  );
}
