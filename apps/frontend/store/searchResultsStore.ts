import { create } from "zustand";
import type { Movie } from "@/types/movie";

type SearchResultsState = {
  strictMovies: Movie[];
  aiMovies: Movie[];
  recommendationMovies: Movie[];

  setStrictMovies: (movies: Movie[]) => void;
  addStrictMovies: (movies: Movie[]) => void;

  setAiMovies: (movies: Movie[]) => void;

  setRecommendationMovies: (movies: Movie[]) => void;
  addRecommendationMovies: (movies: Movie[]) => void;
};

export const useSearchResultsStore = create<SearchResultsState>((set) => ({
  strictMovies: [],
  aiMovies: [],
  recommendationMovies: [],

  setStrictMovies: (movies) => set({ strictMovies: movies }),

  addStrictMovies: (movies) =>
    set((state) => ({
      strictMovies: [...state.strictMovies, ...movies],
    })),

  setAiMovies: (movies) => set({ aiMovies: movies }),

  setRecommendationMovies: (movies) =>
    set({
      recommendationMovies: movies,
    }),

  addRecommendationMovies: (movies) =>
    set((state) => ({
      recommendationMovies: [...state.recommendationMovies, ...movies],
    })),
}));
