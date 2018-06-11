class T {
	constructor(prob = null, label = "") {
		this.prob = prob;
		this.label = label;
	}
}

const states = ["F", "L"];
const start_prob = {
	"F": Math.log10(0.5),
	"L": Math.log10(0.5)
};
const trans_prob = {
	"F": {
		"F": Math.log10(0.95),
		"L": Math.log10(0.05)
	},
	"L": {
		"F": Math.log10(0.1),
		"L": Math.log10(0.9)
	}
}
const emiss_prob = {
	'F': {
		'1': Math.log10(1 / 6),
		'2': Math.log10(1 / 6),
		'3': Math.log10(1 / 6),
		'4': Math.log10(1 / 6),
		'5': Math.log10(1 / 6),
		'6': Math.log10(1 / 6)
	},
	'L': {
		'1': Math.log10(1 / 10),
		'2': Math.log10(1 / 10),
		'3': Math.log10(1 / 10),
		'4': Math.log10(1 / 10),
		'5': Math.log10(1 / 10),
		'6': Math.log10(1 / 2)
	}
}



async function viterbi(observs, states, sp, tp, ep) {
	let Ts = [];
	for (const st of states) {
		Ts[st] = new T(sp[st] + ep[st][observs[0]], st);
	}
	for (let i = 1; i < observs.length; i++) {
		Ts = await next_state(observs[i], states, Ts, tp, ep);
	}
	let maxT;
	for (const t in Ts) {
		if (!maxT || maxT["prob"] < Ts[t]["prob"]) maxT = Ts[t];
	}
	return maxT;
}


async function next_state(ob, states, Ts, tp, ep) {
	const U = [];
	for (const next_s of states) {
		for (const now_s of states) {
			prob = Ts[now_s]["prob"] + tp[now_s][next_s];
			if (!U[next_s] || U[next_s]["prob"] < prob) {
				U[next_s] = new T(prob, Ts[now_s]["label"] + next_s);
			}
		}
	}
	for (const state of states) {
		U[state]["prob"] += ep[state][ob]
	}
	return U;
}

async function calc(options) {
	const {
		observations
	} = require('../src/example-hmm');
	const result = await viterbi(observations.split(''), states,
		start_prob, trans_prob, emiss_prob);
	return {
		input: {
			observations: observations
		},
		output: {
			prob: Math.pow(10, result["prob"]),
			path: result["label"]
		}
	}
}

module.exports = calc;
