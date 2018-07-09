const arr2obj = require('../arr2obj');
const convert2log = require('../convert2log.js');
const convert2exp = require('../convert2exp.js');

class T {
	constructor(prob = null, variable) {
		this.prob = prob;
		this.variable = variable;
	}
}

async function backward(observs, states, _sp, _tp, _ep, options) {
	const sp = await convert2log(_sp);
	const tp = await convert2log(_tp);
	const ep = await convert2log(_ep);
	let Ts = [];
	const Tss = [];
	for (const st of states) {
		Ts[st] = new T(Math.log(1), Math.log(1));
	}
	if (options && options.verbose) Tss.push(await convert2exp(Ts));
	for (let i = 0; i < observs.length - 1; i++) {
		const j = observs.length - i - 1;
		Ts = await prev_state(observs[j], states, Ts, tp, ep);
		if (options && options.verbose) Tss.push(await convert2exp(Ts));
	}
	let prob = 0;
	for (const t in Ts) {
		prob += Math.exp(sp[t] + ep[t][observs[0]] + Ts[t]["variable"]);
	}
	const expTs = await convert2exp(Ts);
	const last_state = await arr2obj(expTs);
	return {
		prob: prob,
		last_state: last_state,
		Tss: Tss ? Tss.reverse() : undefined
	}
}


async function prev_state(ob, states, Ts, tp, ep) {
	const Us = [];
	for (const next_s of states) {
		let variable = 0;
		for (const now_s of states) {
			variable += Math.exp(ep[now_s][ob] + Ts[now_s]["variable"] + tp[next_s][now_s]);
		}
		const prob = ep[next_s][ob] + Math.log(variable);
		Us[next_s] = new T(prob, Math.log(variable));
	}
	return Us;
}

module.exports = backward;
