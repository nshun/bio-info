const arr2obj = require('../arr2obj');
const convert2log = require('../convert2log.js');
const convert2exp = require('../convert2exp.js');

class T {
	constructor(prob = null, scale) {
		this.prob = prob;
		this.scale = scale;
	}
}

async function forward(observs, states, sp, tp, ep) {
	await convert2log(sp);
	await convert2log(tp);
	await convert2log(ep);
	let Ts = [];
	for (const st of states) {
		Ts[st] = new T(sp[st] + ep[st][observs[0]]);
	}
	for (let i = 1; i < observs.length; i++) {
		Ts = await next_state(observs[i], states, Ts, tp, ep);
	}
	let prob = 0;
	for (const t in Ts) {
		prob += Math.exp(Ts[t]["prob"] + Math.log(1));
	}
	const last_state = await arr2obj(await convert2exp(Ts));
	return {
		prob: prob,
		last_state: last_state
	};
}


async function next_state(ob, states, Ts, tp, ep) {
	const Us = [];
	for (const next_s of states) {
		let sum = 0;
		for (const now_s of states) {
			sum += Math.exp(Ts[now_s]["prob"] + tp[now_s][next_s]);
		}
		Us[next_s] = new T(Math.log(sum));
	}
	for (const state of states) {
		Us[state]["prob"] += ep[state][ob];
	}
	return Us;
}

module.exports = forward;
