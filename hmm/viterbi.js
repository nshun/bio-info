class T {
	constructor(prob = null, label = "") {
		this.prob = prob;
		this.label = label;
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

module.exports = viterbi;
