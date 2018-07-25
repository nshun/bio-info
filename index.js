const fs = require('fs');
let argv = require('optimist').argv;
require('module-alias/register');

(async function main() {
	if (!argv.kind)
		return Promise.reject(new Error('no "kind" option!'));

	const mainpath = `./${argv.kind}/main.js`;
	if (!fs.existsSync(mainpath) || !fs.statSync(mainpath).isFile())
		return Promise.reject(new Error(`kind=${argv.kind} is not found.`));
	const main = require(mainpath);
	let result = await main(argv);

	console.log(JSON.stringify(result, null, 1));
})();
