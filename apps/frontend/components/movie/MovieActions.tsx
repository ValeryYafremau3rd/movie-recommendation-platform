"use client";

import { useMovieStore } from "@/store/movieStore";
import { Movie } from "@/types/movie";

type MovieActionsProps = {
  movie: Movie;
};

export default function MovieActions({ movie }: MovieActionsProps) {
  const { liked, disliked, saved, toggleLiked, toggleDisliked, toggleSaved } =
    useMovieStore();

  if (!movie) {
    return null;
  }

  const isLiked = liked.some((m) => m?.id === movie.id);
  const isDisliked = disliked.some((m) => m?.id === movie.id);
  const isSaved = saved.some((m) => m?.id === movie.id);

  return (
    <div className="flex gap-1">
      <button
        type="button"
        title={isLiked ? "Unlike" : "Like"}
        aria-label={isLiked ? "Unlike" : "Like"}
        onClick={() => toggleLiked(movie)}
        className={`rounded p-1 text-sm ${
          isLiked ? "bg-green-100" : "bg-white/30 hover:bg-white"
        }`}
      >
        Like 👍
      </button>

      <button
        type="button"
        title={isDisliked ? "Remove dislike" : "Dislike"}
        aria-label={isDisliked ? "Remove dislike" : "Dislike"}
        onClick={() => toggleDisliked(movie)}
        className={`rounded p-1 text-sm ${
          isDisliked ? "bg-red-100" : "bg-white/30 hover:bg-white"
        }`}
      >
        Dislike 👎
      </button>

      <button
        type="button"
        title={isSaved ? "Unsave" : "Save"}
        aria-label={isSaved ? "Unsave" : "Save"}
        onClick={() => toggleSaved(movie)}
        className={`rounded p-1 text-sm ${
          isSaved ? "bg-blue-100" : "bg-white/30 hover:bg-white"
        }`}
      >
        Save 🔖
      </button>
    </div>
  );
}
