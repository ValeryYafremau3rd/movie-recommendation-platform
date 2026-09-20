export const SAVE_AWARD = `
	INSERT INTO awards (
		id,
		name
	)
	VALUES (?, ?)
	ON CONFLICT(name) DO NOTHING
`;

export const SAVE_AWARD_REL = `
	INSERT INTO movie_awards (
		movie_id,
		award_id,
		category,
		result
	)
	VALUES (?, ?, ?, ?)
	ON CONFLICT(movie_id, award_id)
	DO UPDATE SET
		category = excluded.category,
		result = excluded.result
`;
