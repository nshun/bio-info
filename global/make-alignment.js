class Alignments {
	constructor(a, b, score) {
		this.a = a ? a : '';
		this.b = b ? b : '';
		this.score = score ? score : 0;
	}
}

function clone(a) {
	return JSON.parse(JSON.stringify(a));
}

const addAlignment = async (alignments, aliNum, cell, dnas) => {
	if (!cell.origins) return;
	const tasks = [];
	const origins = cell.origins;
	if (1 < origins.length) {
		const oldAlignment = clone(alignments[aliNum]);
		for (let i = 1; i < origins.length; i++) {
			const origin = origins[i];
			alignments.push(new Alignments(oldAlignment.a, oldAlignment.b));
			const aliNum = alignments.length - 1;
			const toA = cell.row !== origin.row ? dnas.a[origin.row] : '-';
			const toB = cell.col !== origin.col ? dnas.b[origin.col] : '-';
			alignments[aliNum].a = toA + alignments[aliNum].a;
			alignments[aliNum].b = toB + alignments[aliNum].b;
			tasks.push(addAlignment(alignments, aliNum, origin, dnas));
		}
	}
	const origin = origins[0];
	const toA = cell.row !== origin.row ? dnas.a[origin.row] : '-';
	const toB = cell.col !== origin.col ? dnas.b[origin.col] : '-';
	alignments[aliNum].a = toA + alignments[aliNum].a;
	alignments[aliNum].b = toB + alignments[aliNum].b;
	tasks.push(addAlignment(alignments, aliNum, origin, dnas));
	return tasks;
}

const make = async (data) => {
	const alignments = [];
	let bestScoreCell = data.table[0][0];
	for (const row of data.table) {
		for (const cell of row) {
			if (bestScoreCell.score < cell.score)
				bestScoreCell = cell
		}
	}
	alignments.push(new Alignments());
	await addAlignment(alignments, 0, bestScoreCell, data.dnas);
	for (const alignment of alignments) {
		alignment.score = bestScoreCell.score;
	}
	return alignments;
}

module.exports = make;
