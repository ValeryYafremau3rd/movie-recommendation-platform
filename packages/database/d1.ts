import topMovies from "./queries/top-movies";
import movieDetails from "./queries/movie-details";
import searchMovie from "./queries/search-movie";
import saveMovieString from "./queries/save-movie";
import { cleanEntityName, slugify, toText } from "../shared/parsers";
import { SAVE_AWARD, SAVE_AWARD_REL } from "./queries/movie-awards";

export default function (DB: any) {
  return {
    getAwardedMovies: async function (MAX_MOVIES = 250) {
      console.log("AWARDED_MOVIES: generating ranking");

      return (await DB.prepare(topMovies).bind(MAX_MOVIES).all()).results || [];
    },

    getDetailedMovie: async function (id: string) {
      const movie = await DB.prepare(movieDetails).bind(id).first();

      if (!movie) {
        throw new Error("Movie not found");
      }
      return {
        movie: {
          ...movie,
          releaseYear: movie.release_year,
          createdAt: movie.created_at,
          updatedAt: movie.updated_at,

          language: movie.language || "English",

          cast: JSON.parse(movie.actors || "[]").map(
            (item: { id: string; name: string }) => item.name,
          ),
          directors: JSON.parse(movie.directors || "[]").map(
            (item: { id: string; name: string }) => item.name,
          ),
          writers: JSON.parse(movie.writers || "[]").map(
            (item: { id: string; name: string }) => item.name,
          ),
          productionCompanies: JSON.parse(
            movie.productionCompanies || "[]",
          ).map((item: { id: string; name: string }) => item.name),
          genres: JSON.parse(movie.genres || "[]").map(
            (item: { id: string; name: string }) => item.name,
          ),
          themes: JSON.parse(movie.themes || "[]").map(
            (item: { id: string; name: string }) => item.name,
          ),

          awards: JSON.parse(movie.awards || "[]"),
        },
      };
    },

    searchEntities: async function (
      table: string,
      searchTerm: string,
      limit = 20,
    ) {
      const allowedTables = new Set([
        "actors",
        "writers",
        "production_companies",
        "directors",
        "genres",
        "themes",
      ]);

      if (!allowedTables.has(table)) {
        throw new Error("Invalid entity type");
      }

      return await DB.prepare(
        `
    		SELECT
    			id,
    			name
    		FROM ${table}
    		WHERE name LIKE ?
    		ORDER BY name COLLATE NOCASE
    		LIMIT ${limit}
    	`,
      )
        .bind(`%${searchTerm.slice(0, 100)}%`)
        .all();
    },
    saveMovie: function (
      movie: any,
      releaseYear: number | string,
      runtime: number | string,
      language: string,
    ) {
      return DB.prepare(saveMovieString)
        .bind(
          toText(movie.id),
          toText(movie.title),
          toText(movie.wikipedia),
          toText(movie.summary),
          toText(movie.poster),
          releaseYear,
          runtime,
          language,
          toText(movie.director),
        )
        .run();
    },
    moviesQuery: function (searchParams: any, cursorData: any, limit = 20) {
      //pagination
      const cursorCondition = cursorData
        ? searchParams.order === "ASC"
          ? `
				AND (
					${searchParams.sortField} > ?
					OR (
						${searchParams.sortField} = ?
						AND id > ?
					)
				)
			`
          : `
				AND (
					${searchParams.sortField} < ?
					OR (
						${searchParams.sortField} = ?
						AND id < ?
					)
				)
			`
        : "";

      const query = `${searchMovie}

	    		${cursorCondition}

	    	ORDER BY ${searchParams.sortField} ${searchParams.order}, id ${searchParams.order}
	    	LIMIT ?
	    `;
      const pattern = `%${searchParams.search}%`;

      const bindings = [
        searchParams.search,
        pattern,
        pattern,

        searchParams.yearFrom,
        searchParams.yearFrom,

        searchParams.yearTo,
        searchParams.yearTo,

        searchParams.actorId,
        searchParams.actorId,

        searchParams.directorId,
        searchParams.directorId,

        searchParams.writerId,
        searchParams.writerId,

        searchParams.genreId,
        searchParams.genreId,

        searchParams.companyId,
        searchParams.companyId,
      ];

      if (cursorData) {
        bindings.push(cursorData.value, cursorData.value, cursorData.id);
      }

      bindings.push(limit + 1);

      return DB.prepare(query)
        .bind(...bindings)
        .all();
    },

    replaceMovieEntities: function (
      entityTable: string,
      relationTable: string,
      entityColumn: string,
      values: any,
      movieId: string,
    ) {
      const items = Array.isArray(values)
        ? [
            ...new Set(
              values.filter(Boolean).map(cleanEntityName).filter(Boolean),
            ),
          ]
        : [];

      console.log("saveMovieEntities", {
        entityTable,
        items,
      });

      if (items.length === 0) {
        return;
      }

      const statements = [];

      for (const name of items) {
        const id = slugify(name);

        statements.push(
          DB.prepare(
            `
            INSERT INTO ${entityTable} (
              id,
              name
            )
            VALUES (?, ?)
            ON CONFLICT(name) DO NOTHING
          `,
          ).bind(id, toText(name)),
        );

        statements.push(
          DB.prepare(
            `
            INSERT INTO ${relationTable} (
              movie_id,
              ${entityColumn}
            )
            VALUES (?, ?)
            ON CONFLICT DO NOTHING
          `,
          ).bind(movieId, id),
        );
      }

      return DB.batch(statements);
    },
    replaceMovieAwards: function (awards: any[], movieId: string) {
      if (!Array.isArray(awards)) {
        return;
      }
      const items = [];

      const seen = new Set();

      for (const award of awards) {
        if (!award || typeof award !== "object") {
          continue;
        }

        const name = cleanEntityName(award.name);

        if (!name) {
          continue;
        }

        const category = toText(award.category) || "other";

        const result = award.result ? 1 : 0;

        const key = `${name}|${category}`;

        if (seen.has(key)) {
          continue;
        }

        seen.add(key);

        items.push({
          name,
          category,
          result,
        });
      }

      console.log("saveMovieAwards", {
        movieId,
        items,
      });

      if (!items.length) {
        return;
      }

      const statements = [];

      for (const award of items) {
        const awardId = slugify(award.name);

        statements.push(
          DB.prepare(SAVE_AWARD).bind(awardId, toText(award.name)),
        );

        statements.push(
          DB.prepare(SAVE_AWARD_REL).bind(
            movieId,
            awardId,
            award.category,
            award.result,
          ),
        );
      }

      return DB.batch(statements);
    },
  };
}
