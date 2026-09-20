const USER_AGENT = "MovieRecommendationPlatform/1.0 (movie ingestion worker)";

export async function fetchWikiPage(wikipediaUrl: string) {
  const response = await fetch(wikipediaUrl, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Wikipedia request failed: ${response.status}`);
  }

  return response.text();
}
