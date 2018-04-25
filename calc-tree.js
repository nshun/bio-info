class Cell {
	constructor(row, col, origin, score) {
		this.row = row;
		this.col = col;
		this.origin = origin;
		this.score = score;
	}
}

const selectOrigin = async (froms, to) => {
	if (froms.length === 0) {
		to.score = 0;
		return to;
	} else {
		let origin;
		for (const from of froms) {
			if (origin) {
				origin = origin.score < from.score ? from : origin;
			} else {
				origin = from;
			}
		}
		to.origin = origin.node;
		to.score = origin.score;
		return to;
	}
}

const makeTable = async (dnaA, dnaB) => {
	const x = dnaA.split('');
	const y = dnaB.split('');
	const table = new Array(dnaA.length + 1);
	for (let i = 0; i < table.length; i++) {
		table[i] = new Array(dnaB.length + 1);
	}
	for (let row = 0; row < table.length; row++) {
		for (let col = 0; col < table[row].length; col++) {
			const froms = [];
			const to = new Cell(row, col, null, null);
			let origin;
			if (0 < col) froms.push({
				node: table[row][col - 1],
				score: table[row][col - 1].score - 2
			});
			if (0 < row && 0 < col) froms.push({
				node: table[row - 1][col - 1],
				score: x[row - 1] === y[col - 1] ?
					table[row - 1][col - 1].score + 2 : table[row - 1][col - 1].score - 1
			})
			if (0 < row) froms.push({
				node: table[row - 1][col],
				score: table[row - 1][col].score - 2
			});
			table[row][col] = await selectOrigin(froms, to);
		}
	}
	return table;
}

const start = async (dnaA, dnaB) => {
	const table = await makeTable(dnaA, dnaB);
	console.log(table);
}

module.exports = start;
