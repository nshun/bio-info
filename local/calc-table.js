class Cell {
	constructor(row, col, origins, score) {
		this.row = row;
		this.col = col;
		this.origins = origins;
		this.score = score;
	}
}

const selectOrigin = async (froms, to, multiSearchFlag) => {
	if (froms.length === 0) {
		to.score = 0;
		return to;
	} else {
		const origins = [];
		let bestScore;
		for (const from of froms) {
			bestScore = bestScore != null && from.score < bestScore ?
				bestScore : from.score;
		}
		for (const from of froms) {
			if (from.score === bestScore) {
				origins.push(from.cell);
				if (!multiSearchFlag) break;
			}
		}
		to.origins = origins;
		to.score = bestScore;
		return to;
	}
}

const makeTable = async (seqA, seqB, multiSearchFlag) => {
	const x = seqA.split('');
	const y = seqB.split('');
	const d = 2;
	const table = new Array(seqA.length + 1);
	for (let i = 0; i < table.length; i++) {
		table[i] = new Array(seqB.length + 1);
	}
	for (let row = 0; row < table.length; row++) {
		for (let col = 0; col < table[row].length; col++) {
			const froms = [];
			const to = new Cell(row, col);
			if (0 < col) froms.push({
				cell: table[row][col - 1],
				score: table[row][col - 1].score - d
			});
			if (0 < row && 0 < col) froms.push({
				cell: table[row - 1][col - 1],
				score: x[row - 1] === y[col - 1] ?
					table[row - 1][col - 1].score + 2 : table[row - 1][col - 1].score - 1
			})
			if (0 < row) froms.push({
				cell: table[row - 1][col],
				score: table[row - 1][col].score - d
			});
			table[row][col] = await selectOrigin(froms, to, multiSearchFlag);
		}
	}
	return table;
}

const start = async (dnaA, dnaB, options) => {
	const multiSearchFlag = options && options.multiSearch ? true : false;
	const table = await makeTable(dnaA, dnaB, multiSearchFlag);
	return table ? table : new Error('empty table');
}

module.exports = start;
