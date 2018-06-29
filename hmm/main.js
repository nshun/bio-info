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

async function calc(options) {
	const {
		observations
	} = require('../src/example-hmm');
	const calc = require('./forward-scale.js'); // require('./viterbi.js');
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
