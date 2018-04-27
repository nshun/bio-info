const argv = require('optimist').argv;
const calcTable = require('./calc-table');
const dnas = require('./src/dna.json');
const makeAlignment = require('./make-alignment');

(async function main() {
	if (!(dnas && dnas.a && dnas.b))
		return console.log('lack dnas');
	const data = {
		dnas: dnas,
		table: await calcTable(dnas.a, dnas.b)
	};
	const result = {
		score: data.table[data.table.length - 1][data.table[0].length - 1].score,
		alignments: await makeAlignment(data)
	};
	console.log(JSON.stringify(result, null, 1));
})();
