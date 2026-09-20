export default `
      INSERT INTO movies (
        id,
        title,
        wikipedia,
        summary,
        poster,
        release_year,
        runtime,
        language,
        director
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        wikipedia = excluded.wikipedia,
        summary = excluded.summary,
        poster = excluded.poster,
        release_year = excluded.release_year,
        runtime = excluded.runtime,
        language = excluded.language,
        director = excluded.director,
        updated_at = CURRENT_TIMESTAMP
    `;
