"use client";

import MovieActions from "@/components/movie/MovieActions";
import { MovieAward, MovieDetailsData } from "@/types/movie";

type MovieDetailsProps = {
  movie: MovieDetailsData;
};

export default function MovieDetailsView({ movie }: MovieDetailsProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-[300px_1fr]">
        {/* Poster */}
        <div>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full rounded-xl object-cover shadow-lg"
          />

          <div className="mt-3">
            <MovieActions movie={movie} />
          </div>
        </div>

        {/* Main information */}
        <div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-blue-900">{movie.title}</h1>

            <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.runtime && movie.runtime + " minute(s)"}</span>
              <span>•</span>
              <span>{movie.language}</span>
            </div>
          </div>

          {/* Summary */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Summary
            </h2>

            <p className="leading-7 text-gray-600">{movie.summary}</p>
          </section>

          {/* Details */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Details
            </h2>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Director</dt>
                <dd className="mt-1 text-gray-900">{movie.director}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Writers</dt>
                <dd className="mt-1 text-gray-900">
                  {movie.writers.join(", ")}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Genres</dt>
                <dd className="mt-1 text-gray-900">
                  {movie.genres.join(", ")}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Production
                </dt>
                <dd className="mt-1 text-gray-900">
                  {movie.productionCompanies.join(", ")}
                </dd>
              </div>
            </dl>
          </section>

          {/* Cast */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Cast</h2>

            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor) => (
                <span
                  key={actor}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {actor}
                </span>
              ))}
            </div>
          </section>

          {/* Themes */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Themes</h2>

            <div className="flex flex-wrap gap-2">
              {movie.themes?.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                >
                  {theme}
                </span>
              ))}
            </div>
          </section>

          {/* Awards */}
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Awards</h2>

            {movie.awards?.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(
                  movie.awards.reduce<Record<string, MovieAward[]>>(
                    (groups, award) => {
                      if (!groups[award.name]) {
                        groups[award.name] = [];
                      }

                      groups[award.name].push(award);

                      return groups;
                    },
                    {},
                  ),
                ).map(([awardName, awards]) => (
                  <div key={awardName}>
                    <h3 className="font-medium text-gray-800">{awardName}</h3>

                    <ul className="mt-1 list-inside list-disc space-y-1 text-gray-600">
                      {awards.map((award) => (
                        <li key={`${award.id}-${award.category}`}>
                          <span>{award.category}</span>{" "}
                          <span
                            className={
                              award.result
                                ? "font-medium text-green-600"
                                : "text-gray-500"
                            }
                          >
                            ({award.result ? "Won" : "Nominated"})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No awards listed.</p>
            )}
          </section>

          {/* Wikipedia */}
          <a
            href={movie.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            View on Wikipedia →
          </a>

          <p className="mt-4 text-xs text-gray-400">Movie ID: {movie.id}</p>
        </div>
      </div>
    </main>
  );
}
