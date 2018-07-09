const fs = require('fs');
const path = require('path');

async function calc(argv) {
	const {
		states,
		start_prob,
		trans_prob,
		emiss_prob
	} = require('../src/example-hmm-model');
	const {
		observations,
		actual_path
	} = require('../src/example-hmm-imput');
	const methodpath = path.resolve(argv.method ?
		`./hmm/${argv.method}.js` : `./hmm/viterbi.js`);
	if (!fs.existsSync(methodpath) || !fs.statSync(methodpath).isFile())
		return Promise.reject(new Error(`method=${argv.method} is not found.`));
	const calc = require(methodpath);
	const result = await calc(observations.split(''), states,
		start_prob, trans_prob, emiss_prob);
	if (result && result["path"]) {
		const pathT = actual_path.split('');
		const pathE = result["path"].split('');
		let correct_cnt = 0;
		for (let i = 0; i < pathT.length; i++) {
			if (pathT[i] === pathE[i]) correct_cnt++;
		}
		result["match"] = correct_cnt / pathT.length;
	}
	return {
		input: {
			observations: observations
		},
		output: result
	}
}

module.exports = calc;
