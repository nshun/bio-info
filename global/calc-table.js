const csvSync = require('csv-parse/lib/sync');
const fs = require('fs');

class Cell {
	constructor(row, col, origins, score) {
		this.row = row;
		this.col = col;
		this.origins = origins;
		this.score = score;
	}
}
const readCSV = (path) => {
	const data = fs.readFileSync(path);
	const res = csvSync(data);
	return res;
}

const selectOrigin = async (froms, to, multiSearchFlag) => {
	if (froms.length == 0) {
		to.score = 0;
		return to;
	} else {
		const origins = [];
		let bestScore = 0;
		for (const from of froms) {
			if (bestScore < from.score) bestScore = from.score;
		}
		if (bestScore == 0) {
			to.origins = null;
			to.score = bestScore;
			return to;
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
	const blosum50 = readCSV('./src/blosum50.csv');
	const aminos = blosum50[0];
	const d = 8;
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
			if (0 < row && 0 < col) {
				froms.push({
					cell: table[row - 1][col - 1],
					score: table[row - 1][col - 1].score + parseInt(blosum50[aminos.indexOf(x[row - 1])][aminos.indexOf(y[col - 1])])
				})
			}
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
