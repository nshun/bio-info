const arr2obj = require('@utilities/arr2obj');

class T {
	constructor(variable, scale) {
		this.variable = variable;
		this.scale = scale;
	}
}

async function backward(observs, states, sp, tp, ep) {
	let Ts = [];
	const Tss = [];
	for (const l of states) {
		Ts[l] = new T(1, 1);
	}
	if (options && options.verbose) Tss.push(Ts);
	for (let i = 0; i < observs.length - 1; i++) {
		const l = observs.length - i - 1;
		Ts = await prev_state(observs[l], states, Ts, tp, ep);
		if (options && options.verbose) Tss.push(Ts);
	}
	let scale = 0;
	for (const l of states) {
		scale += sp[l] * Ts[l]["variable"] * ep[l][observs[0]];
	}
	return {
		prob: Ts[states[0]]["scale"] * scale,
		last_state: await arr2obj(Ts)
	};
}


async function prev_state(ob, states, Ts, tp, ep) {
	const Us = [];
	const piS = Ts[states[0]]["scale"];
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
		Us[l] = new T(variable, piS * scale);
	}
	return Us;
}

module.exports = backward;
