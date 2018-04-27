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
	console.log(data.table);
	makeAlignment(data);
})();
