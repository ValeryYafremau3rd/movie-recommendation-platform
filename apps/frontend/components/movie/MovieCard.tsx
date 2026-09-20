"use client";

import Link from "next/link";
import MovieActions from "@/components/movie/MovieActions";
import { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="relative overflow-hidden rounded-lg bg-white shadow-sm">
      <Link
        href={`/movies/${movie.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="aspect-2/3 w-full object-cover"
        />

        <div className="p-3">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {movie.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {movie.release_year || movie.releaseYear || movie.year}
          </p>
        </div>
      </Link>

      <div className="absolute bottom-[68px] left-2">
        <MovieActions movie={movie} />
      </div>
    </article>
  );
}
