const states = ["F", "L"];
const start_prob = {
	"F": Math.log(0.5),
	"L": Math.log(0.5)
};
const trans_prob = {
	"F": {
		"F": Math.log(0.95),
		"L": Math.log(0.05)
	},
	"L": {
		"F": Math.log(0.1),
		"L": Math.log(0.9)
	}
}
const emiss_prob = {
	'F': {
		'1': Math.log(1 / 6),
		'2': Math.log(1 / 6),
		'3': Math.log(1 / 6),
		'4': Math.log(1 / 6),
		'5': Math.log(1 / 6),
		'6': Math.log(1 / 6)
	},
	'L': {
		'1': Math.log(1 / 10),
		'2': Math.log(1 / 10),
		'3': Math.log(1 / 10),
		'4': Math.log(1 / 10),
		'5': Math.log(1 / 10),
		'6': Math.log(1 / 2)
	}
}

async function calc(options) {
	const {
		observations
	} = require('../src/example-hmm');
	const calc = require('./forward.js'); // require('./viterbi.js');
	const result = await calc(observations.split(''), states,
		start_prob, trans_prob, emiss_prob);
	return {
		input: {
			observations: observations
		},
		output: {
			prob: Math.exp(result["prob"]),
			path: result["label"]
		}
	}
}

module.exports = calc;
