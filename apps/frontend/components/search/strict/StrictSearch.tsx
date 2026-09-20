"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  SearchFilters,
  SearchItem,
} from "@/types/searchResources";
import { MovieSearchParams } from "@/types/movie";
import { fetchMovies } from "@/api/movies.api";
import { useSearchResultsStore } from "@/store/searchResultsStore";

import StrictSearchForm from "./StrictSearchForm";
import StrictSearchResults from "./StrictSearchResults";
import SubHeader from "@/components/SubHeader";

const EMPTY_FILTERS: SearchFilters = {
  search: "",
  yearFrom: "",
  yearTo: "",
  resources: {},
  sort: "title",
  order: "asc",
};

export default function StrictSearch() {
  const strictMovies = useSearchResultsStore((state) => state.strictMovies);

  const setStrictMovies = useSearchResultsStore(
    (state) => state.setStrictMovies,
  );

  const addStrictMovies = useSearchResultsStore(
    (state) => state.addStrictMovies,
  );

  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);

  const [submittedFilters, setSubmittedFilters] =
    useState<MovieSearchParams | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["strict-search", submittedFilters],
    queryFn: async ({ pageParam }) => {
      const result = await fetchMovies({
        ...submittedFilters!,
        cursor: pageParam,
      });

      if (pageParam) {
        addStrictMovies(result.movies);
      } else {
        setStrictMovies(result.movies);
      }

      return result;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: submittedFilters !== null,
    gcTime: 0,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmittedFilters({
      search: filters.search.trim(),
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,

      sort: filters.sort,
      order: filters.order,

      actorId: filters.resources.actors?.id,
      directorId: filters.resources.directors?.id,
      writerId: filters.resources.writers?.id,
      genreId: filters.resources.genres?.id,
      companyId: filters.resources.companies?.id,
    });
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    setSubmittedFilters(null);
    setStrictMovies([]);
  }

  function handleResourceSelect(resourceKey: string, item: SearchItem | null) {
    setFilters((current) => ({
      ...current,
      resources: {
        ...current.resources,
        [resourceKey]: item,
      },
    }));
  }

  return (
    <section>
      <SubHeader
        title="Strict Search"
        description="Search movies by title, year, actors, directors, writers, genres, and production companies."
      />

      <StrictSearchForm
        filters={filters}
        onFiltersChange={setFilters}
        onResourceSelect={handleResourceSelect}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />

      <StrictSearchResults
        movies={strictMovies}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isFetchingNextPage={query.isFetchingNextPage}
        error={query.error}
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </section>
  );
}
