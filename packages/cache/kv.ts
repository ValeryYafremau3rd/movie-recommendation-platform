export default function (KV: any) {
  return {
    putTopMovies: async function (
      movies: any[],
      CACHE_KEY = "top-awarded-movies",
    ) {
      console.log("AWARDED_MOVIES: ranking saved to KV");

      return await KV.put(CACHE_KEY, JSON.stringify(movies));
    },
    getTopMovies: async function (
      movies: any[],
      CACHE_KEY = "top-awarded-movies",
    ) {
      console.log("AWARDED_MOVIES: ranking saved to KV");

      return await KV.get(CACHE_KEY, JSON.stringify(movies));
    },
  };
}
