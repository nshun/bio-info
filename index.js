let argv = require('optimist').argv;

(async function main() {
	if (!argv.kind || (argv.kind !== 'local' && argv.kind !== 'global'))
		return console.log('no "kind" option!');

	const aligment = argv.kind === 'local' ?
		require('./local/local-alignment') : require('./global/global-alignment');
	let result = await aligment(argv);

	console.log(JSON.stringify(result, null, 1));
})();
