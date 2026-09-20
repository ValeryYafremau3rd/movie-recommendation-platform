import {
  Movie,
  MovieDetailsData,
  MovieSearchParams,
  MoviesResponse,
} from "@/types/movie";

const apiUrl = process.env.NEXT_PUBLIC_MOVIE_API_URL;
const aiUrl = process.env.NEXT_PUBLIC_AI_SEARCH_API_URL;

export async function getTop100Movies(): Promise<Movie[]> {
  const response = await fetch(`${apiUrl}/top100`);

  if (!response.ok) {
    throw new Error(`Failed to fetch top 250 movies: ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data) ? data : (data.movies ?? []);
}

export async function fetchMovie(id: string): Promise<MovieDetailsData> {
  const url = new URL(`/movies/${encodeURIComponent(id)}`, apiUrl);
  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Movie not found");
    }
    throw new Error(`Movie API returned ${response.status}`);
  }

  const data = await response.json();

  return data.movie;
}

export async function aiSearchMovies(prompt: string): Promise<{
  movies: Movie[];
  count: number;
}> {
  const url = new URL("/search", aiUrl);
  url.searchParams.set("prompt", prompt);
  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`AI Search API returned ${response.status}`);
  }

  return response.json();
}

export async function fetchResourse(resource: string, query: string) {
  const url = new URL(resource, apiUrl);
  url.searchParams.set("search", query);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Search API returned ${response.status}`);
  }

  const data = await response.json();

  return {
    items: Array.isArray(data.items) ? data.items : [],
  };
}

export async function fetchMovies(
  params: MovieSearchParams,
): Promise<MoviesResponse> {
  const url = new URL("movies", apiUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Movie API returned ${response.status}`);
  }

  return (await response.json()) as MoviesResponse;
}
