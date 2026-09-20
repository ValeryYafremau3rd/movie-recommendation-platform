import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { SearchItem } from "@/types/searchResources";
import { fetchResourse } from "@/api/movies.api";

const DEBOUNCE_MS = 1000;

type UseDebouncedQueryProps = {
  endpoint: string;
  query: string;
  enabled?: boolean;
};

type SearchResponse = {
  items: SearchItem[];
};

export function useDebouncedQuery({
  endpoint,
  query,
  enabled = true,
}: UseDebouncedQueryProps) {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["resource-search", endpoint, debouncedQuery],
    queryFn: () => fetchResourse(endpoint, debouncedQuery),
    enabled: enabled && debouncedQuery.length >= 2,
  });

  return {
    items: data?.items ?? [],
    isLoading,
    error,
  };
}
