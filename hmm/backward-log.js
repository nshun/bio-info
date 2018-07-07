const convert2log = require('../convert2log.js')

class T {
	constructor(prob = null, scale = null) {
		this.prob = prob;
		this.scale = scale;
	}
}

async function backward(observs, states, sp, tp, ep) {
	await convert2log(sp);
	await convert2log(tp);
	await convert2log(ep);
	let Ts = [];
	for (const st of states) {
		Ts[st] = new T(Math.log(1));
	}
	for (let i = 0; i < observs.length - 1; i++) {
		const j = observs.length - i - 1;
		Ts = await prev_state(observs[j], states, Ts, tp, ep);
	}
	let sum = 0;
	for (const t in Ts) {
		sum += Math.exp(sp[t] + ep[t][observs[0]] + Ts[t]["prob"]);
	}
	return new T(sum);
}


async function prev_state(ob, states, Ts, tp, ep) {
	const Us = [];
	for (const next_s of states) {
		let sum = 0;
		for (const now_s of states) {
			sum += Math.exp(ep[now_s][ob] + Ts[now_s]["prob"] + tp[next_s][now_s]);
		}
		Us[next_s] = new T(Math.log(sum));
	}
	return Us;
}

module.exports = backward;
