import { Movie } from "@/types/movie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type MovieStore = {
  liked: Movie[];
  disliked: Movie[];
  saved: Movie[];

  toggleLiked: (movie: Movie) => void;
  toggleDisliked: (movie: Movie) => void;
  toggleSaved: (movie: Movie) => void;
};

export const useMovieStore = create<MovieStore>()(
  persist(
    (set) => ({
      liked: [],
      disliked: [],
      saved: [],

      toggleLiked: (movie) =>
        set((state) => ({
          liked: state.liked.some((m) => m.id === movie.id)
            ? state.liked.filter((m) => m.id !== movie.id)
            : [...state.liked, movie],
          disliked: state.disliked.filter((m) => m.id !== movie.id),
        })),

      toggleDisliked: (movie) =>
        set((state) => ({
          disliked: state.disliked.some((m) => m.id === movie.id)
            ? state.disliked.filter((m) => m.id !== movie.id)
            : [...state.disliked, movie],
          liked: state.liked.filter((m) => m.id !== movie.id),
        })),

      toggleSaved: (movie) =>
        set((state) => ({
          saved: state.saved.some((m) => m.id === movie.id)
            ? state.saved.filter((m) => m.id !== movie.id)
            : [...state.saved, movie],
        })),
    }),
    {
      name: "movie-library",
    },
  ),
);
