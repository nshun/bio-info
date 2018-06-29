class T {
	constructor(prob = null, scale = null) {
		this.prob = prob;
		this.scale = scale;
	}
}

async function forward(observs, states, sp, tp, ep) {
	let Ts = [];
	for (const st of states) {
		const scale = ep[st][observs[0]] * sp[st];
		const prob = 1 / scale * ep[st][observs[0]] * sp[st];
		Ts[st] = new T(prob, scale);
	}
	for (let i = 1; i < observs.length; i++) {
		Ts = await next_state(observs[i], states, Ts, tp, ep);
	}
	let pi = 1;
	for (const t in Ts) {
		pi *= Ts[t]["scale"];
	}
	return new T(pi);
}


async function next_state(ob, states, Ts, tp, ep) {
	const Us = [];
	for (const next_s of states) {
		let sumF = 0;
		for (const now_s of states) {
			sumF += Ts[now_s]["prob"] / Ts[now_s]["scale"] * tp[now_s][next_s];
		}
		const scale = sumE * sumF;
		const prob = 1 / scale * ep[next_s][ob] * sumF;
		Us[next_s] = new T(prob, scale);
	}
	return Us;
}

module.exports = forward;
