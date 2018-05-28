const calcTable = require('./calc-table');
const makeAlignment = require('./make-alignment');

var argv = require('optimist').argv;

async function calc(dnas, argv) {
	const start = process.hrtime();
	const data = {
		dnas: dnas,
		table: await calcTable(dnas.a, dnas.b, argv)
	};
	const alignments = await makeAlignment(data);
	const end = process.hrtime(start);
	const elapsed_ms = (end[0] * 1000) + (end[1] / 1000000);
	return {
		elapsed_ms,
		data,
		alignments
	}
}

(async function main() {
	const dnas = argv.src && require(argv.src) ?
		require(argv.src) : require('./src/dna.json');
	const loop = argv.loop && argv.loop === parseInt(argv.loop) ? argv.loop : 1;
	if (!(dnas && dnas.a && dnas.b))
		return console.log('lack dnas');

	let {
		elapsed_ms,
		data,
		alignments
	} = await calc(dnas, argv);

	const averageTimeMs = await new Promise(async (resolve, reject) => {
		let sum = 0;
		for (let i = 0; i < loop; i++) {
			({
				elapsed_ms
			} = await calc(dnas, argv));
			sum += elapsed_ms;
		}
		resolve(sum / loop);
	});

	const result = {
		inputs: dnas,
		options: argv,
		score: data.table[data.table.length - 1][data.table[0].length - 1].score,
		alignments: alignments,
		elapsed_ms: averageTimeMs
	};
	console.log(JSON.stringify(result, null, 1));
})();
