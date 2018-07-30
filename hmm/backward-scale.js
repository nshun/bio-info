const arr2obj = require('@utilities/arr2obj');

class T {
	constructor(variable, scale) {
		this.variable = variable;
		this.scale = scale;
	}
}

async function backward(observs, states, sp, tp, ep, options) {
	let Ts = [];
	const Tss = [];
	for (const l of states) {
		Ts[l] = new T(1, Math.log(1));
	}
	if (options && options.verbose) Tss.push(Ts);
	for (let i = 0; i < observs.length - 1; i++) {
		const l = observs.length - i - 1;
		if (l === 1) {
			console.log();
		}
		Ts = await prev_state(observs[l], states, Ts, tp, ep);
		if (options && options.verbose) Tss.push(Ts);
	}
	let scale = 0;
	for (const l of states) {
		scale += sp[l] * Ts[l]["variable"] * ep[l][observs[0]];
	}
	return {
		prob: Math.exp(Ts[states[0]]["scale"] + Math.log(scale)),
		last_state: await arr2obj(Ts),
		Tss: Tss ? Tss.reverse() : undefined
	};
}


async function prev_state(ob, states, Ts, tp, ep) {
	const Us = [];
	let scale = 0;
	for (const l of states) {
		for (const k of states) {
			scale += tp[l][k] * Ts[k]["variable"] * ep[l][ob];
		}
	}
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += tp[l][k] * Ts[k]["variable"] * ep[l][ob];
		}
		const variable = sumF / scale;
		Us[l] = new T(variable, Ts[states[0]]["scale"] + Math.log(scale));
	}
	return Us;
}

module.exports = backward;
