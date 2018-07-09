const convert2log = require('../convert2log.js')

class T {
	constructor(prob = null, path = "") {
		this.prob = prob;
		this.path = path;
	}
}

async function viterbi(observs, states, _sp, _tp, _ep) {
	const sp = await convert2log(_sp);
	const tp = await convert2log(_tp);
	const ep = await convert2log(_ep);
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
	maxT["prob"] = Math.exp(maxT["prob"]);
	return maxT;
}


async function next_state(ob, states, Ts, tp, ep) {
	const U = [];
	for (const next_s of states) {
		for (const now_s of states) {
			prob = Ts[now_s]["prob"] + tp[now_s][next_s];
			if (!U[next_s] || U[next_s]["prob"] < prob) {
				U[next_s] = new T(prob, Ts[now_s]["path"] + next_s);
			}
		}
	}
	for (const state of states) {
		U[state]["prob"] += ep[state][ob]
	}
	return U;
}

module.exports = viterbi;
