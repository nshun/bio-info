const fs = require('fs');
const path = require('path');
const states = ["F", "L"];
const start_prob = {
	"F": 0.5,
	"L": 0.5
};
const trans_prob = {
	"F": {
		"F": 0.95,
		"L": 0.05
	},
	"L": {
		"F": 0.1,
		"L": 0.9
	}
}
const emiss_prob = {
	'F': {
		'1': 1 / 6,
		'2': 1 / 6,
		'3': 1 / 6,
		'4': 1 / 6,
		'5': 1 / 6,
		'6': 1 / 6
	},
	'L': {
		'1': 1 / 10,
		'2': 1 / 10,
		'3': 1 / 10,
		'4': 1 / 10,
		'5': 1 / 10,
		'6': 1 / 2
	}
}

async function calc(argv) {
	const {
		observations,
		actual_path
	} = require('../src/example-hmm');
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
