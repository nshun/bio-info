const fs = require('fs');
let argv = require('optimist').argv;

(async function main() {
	if (!argv.kind)
		return console.log('no "kind" option!');

	const mainpath = `./${argv.kind}/main.js`
	if (!fs.existsSync(mainpath) || !fs.statSync(mainpath).isFile())
		return console.log(`${argv.kind} is not found.`);
	const main = require(mainpath);
	let result = await main(argv);

	console.log(JSON.stringify(result, null, 1));
})();
