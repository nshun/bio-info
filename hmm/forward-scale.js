const arr2obj = require('../arr2obj');

class T {
	constructor(prob = null, scale) {
		this.prob = prob;
		this.scale = scale;
	}
}

async function forward(observs, states, sp, tp, ep) {
	let Ts = [];
	let scale = 0;
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += 1 * sp[k];
		}
		scale += ep[l][observs[0]] * sumF;
	}
	for (const l of states) {
		const sumF = 1 * sp[l];
		const prob = ep[l][observs[0]] / scale * sumF;
		Ts[l] = new T(prob, scale);
	}
	for (let i = 1; i < observs.length; i++) {
		Ts = await next_state(observs[i], states, Ts, tp, ep);
	}
	const last_state = await arr2obj(Ts);
	return {
		prob: Ts[states[0]]["scale"],
		last_state: last_state
	};
}


async function next_state(ob, states, Ts, tp, ep) {
	const Us = [];
	const piS = Ts[states[0]]["scale"];
	let scale = 0;
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += Ts[k]["prob"] * tp[k][l];
		}
		scale += ep[l][ob] * sumF;
	}
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += Ts[k]["prob"] * tp[k][l];
		}
		const prob = ep[l][ob] / scale * sumF;
		Us[l] = new T(prob, piS * scale);
	}
	return Us;
}

module.exports = forward;
