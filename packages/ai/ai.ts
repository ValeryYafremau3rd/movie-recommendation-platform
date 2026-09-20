export default function (ai: any, model = "@cf/baai/bge-small-en-v1.5") {
  return {
    createVector: async function (prompt: string) {
      const embedding = await ai.run("@cf/baai/bge-small-en-v1.5", {
        text: [prompt],
      });

      const vector = embedding?.data?.[0];

      if (!vector) {
        throw new Error("Failed to create query embedding");
      }

      if (!Array.isArray(vector)) {
        throw new Error(`Embedding is not an array: ${typeof vector}`);
      }

      if (vector.length !== 384) {
        throw new Error(`Invalid embedding dimensions: ${vector.length}`);
      }

      if (!vector.every(Number.isFinite)) {
        throw new Error("Embedding contains non-finite values");
      }

      return vector;
    },
  };
}
