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

function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

async function convert2log(list2log) {
	const convert = async function (list) {
		const loglist = [];
		for (const key in list) {
			const el = list[key];
			const logitem = isArray(el) ?
				await convert(el) : isFinite(el) ? Math.log(el) : el;
			loglist[key] = logitem;
		}
		return loglist;
	};
	loglist = await convert(list2log);
	for (const key in list2log) {
		list2log[key] = loglist[key];
	}
}

async function calc(options) {
	const {
		observations
	} = require('../src/example-hmm');
	const globalvars = [states, start_prob, trans_prob, emiss_prob];
	if (!options['method'] || options['method'] !== 'scaling') {
		for (const item of globalvars) {
			await convert2log(item);
		}
	}
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
