const arr2obj = require('@utilities/arr2obj');
const convert2log = require('@utilities/convert2log');
const convert2exp = require('@utilities/convert2exp');
const logsumexp = require('@utilities/logsumexp');

class T {
	constructor(variable) {
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
		Ts[st] = new T(Math.log(1));
	}
	if (options && options.verbose) Tss.push(Ts);
	for (let i = 0; i < observs.length - 1; i++) {
		const j = observs.length - i - 1;
		Ts = await prev_state(observs[j], states, Ts, tp, ep);
		if (options && options.verbose) Tss.push(Ts);
	}
	const arr = [];
	for (const t in Ts) {
		arr.push(sp[t] + ep[t][observs[0]] + Ts[t]["variable"]);
	}
	const prob = logsumexp(arr);
	const last_state = await arr2obj(await convert2exp(Ts));
	return {
		prob: Math.exp(prob),
		last_state: last_state,
		Tss: Tss ? Tss.reverse() : undefined
	}
}


async function prev_state(ob, states, Ts, tp, ep) {
	const Us = [];
	for (const next_s of states) {
		const arr = [];
		for (const now_s of states) {
			arr.push(ep[now_s][ob] + Ts[now_s]["variable"] + tp[next_s][now_s]);
		}
		Us[next_s] = new T(logsumexp(arr));
	}
	return Us;
}

module.exports = backward;
