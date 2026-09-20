export default function validateSearchParams(searchParams: any): boolean {
  if (
    searchParams.yearFrom !== null &&
    !Number.isInteger(searchParams.yearFrom)
  ) {
    throw new Error("yearFrom must be an integer");
  }

  if (searchParams.yearTo !== null && !Number.isInteger(searchParams.yearTo)) {
    throw new Error("yearTo must be an integer");
  }

  if (
    searchParams.yearFrom !== null &&
    searchParams.yearTo !== null &&
    searchParams.yearFrom > searchParams.yearTo
  ) {
    throw new Error("yearFrom cannot be greater than yearTo");
  }

  if (!searchParams.sortField) {
    throw new Error("Invalid sort field.");
  }

  if (searchParams.order !== "ASC" && searchParams.order !== "DESC") {
    throw new Error("Invalid sort order.");
  }

  return true;
}
