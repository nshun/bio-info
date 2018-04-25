const argv = require('optimist').argv;
const calc = require('./calc-tree.js');
const dnas = require('./src/dna.json');

(function main() {
	return new Promise((resolve, reject) => {
		if (dnas && dnas.a && dnas.b) resolve(calc(dnas.a, dnas.b));
		else reject();
	});
})();
