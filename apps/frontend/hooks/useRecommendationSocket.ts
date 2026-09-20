"use client";

import { useState } from "react";

import { Movie } from "@/types/movie";
import { requestRecommendations } from "@/api/recommendation.ws";

type UseRecommendationSocketProps = {
  liked: Movie[];
  disliked: Movie[];
  saved: Movie[];
  onRecommendations: (movies: Movie[]) => void;
};

export function useRecommendationSocket({
  liked,
  disliked,
  saved,
  onRecommendations,
}: UseRecommendationSocketProps) {
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function request() {
    requestRecommendations(liked, disliked, saved, {
      onRecommendations: (movies) => {
        setError(null);
        onRecommendations(movies);
      },

      onError: (message) => {
        setError(message || null);
      },

      onLoading: (loading) => {
        setLoadingMore(loading);
      },
    });
  }

  return {
    loadingMore,
    error,
    requestRecommendations: request,
  };
}
