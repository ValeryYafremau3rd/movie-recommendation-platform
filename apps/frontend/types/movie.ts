import { SortField, SortOrder } from "./searchResources";

export type Movie = {
  id: string;
  title: string;
  poster: string;
  year?: number;
  releaseYear?: number;
  release_year?: number;
};

export type MovieAward = {
  id: string;
  name: string;
  category: string;
  result: boolean;
};

export type MovieDetailsData = Movie & {
  wikipedia: string;
  runtime: string;
  language: string[];
  director: string;
  writers: string[];
  cast: string[];
  productionCompanies: string[];
  genres: string[];
  themes: string[];
  awards: MovieAward[];
  summary: string;
};

export type MoviesResponse = {
  movies: Movie[];
  count: number;
  nextCursor: string | null;
};

export type MovieSearchParams = {
  search: string;
  yearFrom: string;
  yearTo: string;

  actorId?: string;
  directorId?: string;
  writerId?: string;
  genreId?: string;
  companyId?: string;

  sort: SortField;
  order: SortOrder;

  cursor?: string | null;
};
