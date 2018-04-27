class Alignment {
	constructor(a, b) {
		this.a = a ? a : '';
		this.b = b ? b : '';
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
			alignments.push(new Alignment(oldAlignment.a, oldAlignment.b));
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
	let row = data.table.length - 1;
	let col = data.table[0].length - 1;
	alignments.push(new Alignment());
	await addAlignment(alignments, 0, data.table[row][col], data.dnas);
	return alignments;
}

module.exports = make;
