let argv = require('optimist').argv;

(async function main() {
	if (!argv.kind || (argv.kind !== 'local' && argv.kind !== 'global' && argv.kind !== 'hmm'))
		return console.log('no "kind" option!');

	const main = require(`./${argv.kind}/main`);
	let result = await main(argv);

	console.log(JSON.stringify(result, null, 1));
})();
