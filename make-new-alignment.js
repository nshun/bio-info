const os = require('os');
const fs = require('fs');
var argv = require('optimist').argv;

class Alignments {
	constructor(a, b) {
		this.a = a ? a : '';
		this.b = b ? b : '';
	}
}

function createAlignment(length) {
	const nucleotide = ['A', 'T', 'C', 'G'];
	let alignment = '';
	for (let i = 0; i < length; i++) {
		alignment = alignment + nucleotide[parseInt(Math.random() * 4)];
	}
	return alignment;
}

(function () {
	if (!argv.l || argv.l < 1 || argv.l !== parseInt(argv.l))
		return console.log("Error at : Length");
	const dnaA = createAlignment(argv.l);
	const dnaB = createAlignment(argv.l);
	const alignments = new Alignments(dnaA, dnaB);
	fs.writeFile(`src/dest${argv.l}.json`, JSON.stringify(alignments, null, 2), "utf8", (error) => {
		if (error) {
			console.log('Error ar : writing');
		}
	});
})();
