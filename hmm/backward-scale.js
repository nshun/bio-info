class T {
	constructor(prob = null, scale = null) {
		this.prob = prob;
		this.scale = scale;
	}
}

async function backward(observs, states, sp, tp, ep) {
	let Ts = [];
	for (const l of states) {
		Ts[l] = new T(1, 1);
	}
	for (let i = 0; i < observs.length - 1; i++) {
		const l = observs.length - i - 1;
		Ts = await prev_state(observs[l], states, Ts, tp, ep);
	}
	let scale = 0;
	for (const l of states) {
		scale += sp[l] * Ts[l]["prob"] * ep[l][observs[0]];
	}
	return new T(Ts[states[0]]["scale"] * scale);
}


async function prev_state(ob, states, Ts, tp, ep) {
	const Us = [];
	const piS = Ts[states[0]]["scale"];
	let scale = 0;
	for (const l of states) {
		for (const k of states) {
			scale += tp[l][k] * Ts[k]["prob"] * ep[l][ob];
		}
	}
	for (const l of states) {
		let sumF = 0;
		for (const k of states) {
			sumF += tp[l][k] * Ts[k]["prob"] * ep[l][ob];
		}
		const prob = sumF / scale;
		Us[l] = new T(prob, piS * scale);
	}
	return Us;
}

module.exports = backward;
