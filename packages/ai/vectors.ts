export default function (indexes: any) {
  return {
    findMatches: async function (vector: number[], topK = 50) {
      const result = await indexes.query(vector, {
        topK,
        returnMetadata: true,
      });

      return (result.matches || [])
        .filter((match: any) => !!match.metadata.director)
        .map((match: any) => ({
          id: match.id,
          score: match.score,
          ...match.metadata,
        }));
    },
    saveVector: async function (
      movie: string,
      vector: number[],
      metadata: any,
    ) {
      return indexes.upsert([
        {
          movie,
          values: vector,
          metadata,
        },
      ]);
    },
  };
}
