"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MovieGrid from "@/components/movie/MovieGrid";
import { useSearchResultsStore } from "@/store/searchResultsStore";
import { aiSearchMovies } from "@/api/movies.api";
import SubHeader from "../SubHeader";

export default function AiSearch() {
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const aiMovies = useSearchResultsStore((state) => state.aiMovies);
  const setAiMovies = useSearchResultsStore((state) => state.setAiMovies);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["ai-search", prompt],
    queryFn: async () => {
      const result = await aiSearchMovies(prompt);
      setAiMovies(result.movies);
      setSubmitted(false);
      return result;
    },
    enabled: submitted && !!prompt.trim().length,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section>
      <SubHeader
        title="Smart search"
        description="Describe what kind of movie you are looking for."
      />

      <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-gray-50 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="e.g. dark sci-fi movies with a philosophical story"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isFetching}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {isLoading && (
        <p className="mb-6 text-sm text-gray-500">Finding movies...</p>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      )}

      {aiMovies.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {data?.count ?? aiMovies.length} movies found
            </p>
          </div>

          <MovieGrid movies={aiMovies} />
        </>
      ) : (
        !isLoading && <p className="text-sm text-gray-500">No movies found.</p>
      )}
    </section>
  );
}
