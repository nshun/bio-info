const calcTable = require('./calc-table');
const makeAlignment = require('./make-alignment');

async function calc(dnas, argv) {
	const start = process.hrtime();
	const data = {
		dnas: dnas,
		table: await calcTable(dnas.a, dnas.b, argv)
	};
	const alignments = await makeAlignment(data);
	const end = process.hrtime(start);
	const elapsedMs = (end[0] * 1000) + (end[1] / 1000000);
	return {
		elapsedMs,
		data,
		alignments
	}
}

async function run(argv) {
	const seqs = argv.src && require(argv.src) ?
		require(argv.src) : require('../src/amino.json');

	const loop = argv.loop && argv.loop === parseInt(argv.loop) ? argv.loop : 1;

	if (!(seqs && seqs.a && seqs.b))
		return console.log('lack sequences');

	let {
		elapsed_ms,
		data,
		alignments
	} = await calc(seqs, argv);

	const averageTimeMs = await new Promise(async (resolve, reject) => {
		let sum = 0;
		for (let i = 0; i < loop; i++) {
			({
				elapsedMs
			} = await calc(seqs, argv));
			sum += elapsedMs;
		}
		resolve(sum / loop);
	});
	const result = {
		inputs: seqs,
		alignments: alignments,
		elapsedMs: averageTimeMs
	};
	return result;
}

module.exports = run;
