"use client";

import MovieGrid from "@/components/movie/MovieGrid";
import { useMovieStore } from "@/store/movieStore";

export default function LikedMovies() {
  const liked = useMovieStore((state) => state.liked);

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Liked Movies</h2>

      <MovieGrid movies={liked} />
    </section>
  );
}
