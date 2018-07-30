const arr2obj = require('@utilities/arr2obj');

class T {
	constructor(variable = null, scale) {
		this.variable = variable;
		this.scale = scale;
	}
}

async function forward(observs, states, sp, tp, ep, options) {
	let Ts = [];
	const Tss = [];
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
		const variable = ep[l][observs[0]] / scale * sumF;
		Ts[l] = new T(variable, Math.log(scale));
	}
	if (options && options.verbose) Tss.push(Ts);
	for (let i = 1; i < observs.length; i++) {
		Ts = await next_state(observs[i], states, Ts, tp, ep);
		if (options && options.verbose) Tss.push(Ts);
	}
	const last_state = await arr2obj(Ts);
	return {
		prob: Math.exp(Ts[states[0]]["scale"]),
		last_state: last_state,
		Tss: Tss ? Tss : undefined
	};
}


async function next_state(ob, states, Ts, tp, ep) {
	const Us = [];
	let scale = 0;
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += Ts[k]["variable"] * tp[k][l];
		}
		scale += ep[l][ob] * sumF;
	}
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += Ts[k]["variable"] * tp[k][l];
		}
		const variable = ep[l][ob] / scale * sumF;
		Us[l] = new T(variable, Ts[states[0]]["scale"] + Math.log(scale));
	}
	return Us;
}

module.exports = forward;
