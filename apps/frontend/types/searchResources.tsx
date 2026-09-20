export type SearchResource = {
  key: string;
  label: string;
  placeholder: string;
  endpoint: string;
};

export type SearchItem = {
  id: string;
  name: string;
};

export type SearchFilters = {
  search: string;
  yearFrom: string;
  yearTo: string;
  resources: Record<string, SearchItem | null>;

  sort: SortField;
  order: SortOrder;
};

export type SortField = "title" | "year";

export type SortOrder = "asc" | "desc";

export const SEARCH_RESOURCES: SearchResource[] = [
  {
    key: "actors",
    label: "Actor",
    placeholder: "Search actor...",
    endpoint: "actors",
  },
  {
    key: "directors",
    label: "Director",
    placeholder: "Search director...",
    endpoint: "directors",
  },
  {
    key: "writers",
    label: "Writer",
    placeholder: "Search writer...",
    endpoint: "writers",
  },
  {
    key: "genres",
    label: "Genre",
    placeholder: "Search genre...",
    endpoint: "genres",
  },
  {
    key: "companies",
    label: "Production company",
    placeholder: "Search company...",
    endpoint: "companies",
  },
];
