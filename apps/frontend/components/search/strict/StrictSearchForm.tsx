"use client";

import {
  SEARCH_RESOURCES,
  SearchFilters,
  SearchItem,
  SortField,
  SortOrder,
} from "@/types/searchResources";
import ResourceCombobox from "./ResourceCombobox";

type StrictSearchFormProps = {
  filters: SearchFilters;

  onFiltersChange: React.Dispatch<React.SetStateAction<SearchFilters>>;

  onResourceSelect: (resourceKey: string, item: SearchItem | null) => void;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
};

export default function StrictSearchForm({
  filters,
  onFiltersChange,
  onResourceSelect,
  onSubmit,
  onClear,
}: StrictSearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8 rounded-xl bg-gray-50 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Title */}
        <div>
          <label
            htmlFor="movie-search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Title
          </label>

          <input
            id="movie-search"
            type="text"
            value={filters.search}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder="Movie title..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Year from */}
        <div>
          <label
            htmlFor="year-from"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Year from
          </label>

          <input
            id="year-from"
            type="number"
            value={filters.yearFrom}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                yearFrom: event.target.value,
              }))
            }
            placeholder="1900"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Year to */}
        <div>
          <label
            htmlFor="year-to"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Year to
          </label>

          <input
            id="year-to"
            type="number"
            value={filters.yearTo}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                yearTo: event.target.value,
              }))
            }
            placeholder="2026"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Resource comboboxes */}
        {SEARCH_RESOURCES.map((resource) => (
          <ResourceCombobox
            key={resource.key}
            resource={resource}
            onSelect={(item) => onResourceSelect(resource.key, item)}
          />
        ))}

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Sort by
          </label>

          <select
            id="sort"
            value={filters.sort}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                sort: event.target.value as SortField,
              }))
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
          </select>
        </div>

        {/* Order */}
        <div>
          <label
            htmlFor="order"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Order
          </label>

          <select
            id="order"
            value={filters.order}
            onChange={(event) =>
              onFiltersChange((current) => ({
                ...current,
                order: event.target.value as SortOrder,
              }))
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
