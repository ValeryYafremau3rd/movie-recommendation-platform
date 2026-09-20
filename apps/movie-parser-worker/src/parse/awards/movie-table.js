export function buildTableGrid(rows) {
	const grid = [];

	const activeRowspans = new Map();

	for (const row of rows) {
		const cells = [...row.querySelectorAll(':scope > th, :scope > td')];

		if (!cells.length) {
			continue;
		}

		const logicalRow = [];

		let columnIndex = 0;

		for (const [column, span] of activeRowspans) {
			if (span.remaining > 0) {
				logicalRow[column] = span.cell;
			}
		}

		for (const cell of cells) {
			while (logicalRow[columnIndex]) {
				columnIndex++;
			}

			const colspan = parseSpan(cell.getAttribute('colspan'));

			const rowspan = parseSpan(cell.getAttribute('rowspan'));

			for (let offset = 0; offset < colspan; offset++) {
				const column = columnIndex + offset;

				logicalRow[column] = cell;

				if (rowspan > 1) {
					activeRowspans.set(column, {
						cell,
						remaining: rowspan - 1,
					});
				}
			}

			columnIndex += colspan;
		}

		grid.push(logicalRow);

		for (const [column, span] of activeRowspans) {
			span.remaining--;

			if (span.remaining <= 0) {
				activeRowspans.delete(column);
			}
		}
	}

	return grid;
}

function parseSpan(value) {
	const number = Number.parseInt(value || '1', 10);

	return Number.isFinite(number) && number > 0 ? number : 1;
}
