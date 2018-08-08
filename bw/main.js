const ratio2prob = require('@utilities/ratio2prob');
const resetprob = require('@utilities/resetprob');
const initprob = require('@utilities/initprob');
const createInput = require('@hmm/create-input');
const forward = require('@hmm/forward-scale');
const backward = require('@hmm/backward-scale');
const viterbi = require('@hmm/viterbi');

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}
async function calc(options) {
	const {
		states,
		start_ratio,
		trans_ratio,
		emiss_ratio
	} = options && options.model ? options.model : require('@src/example-hmm-model');

	const sp = await ratio2prob(start_ratio);
	const tp = await ratio2prob(trans_ratio);
	const ep = await ratio2prob(emiss_ratio);

	const length = options && options.length ? parseInt(options.length) : 300;

	const {
		observations: obs,
		actual_path: actual_path
	} = await createInput(states, sp, tp, ep, length);

	const spP = await initprob(sp);
	let epP = await initprob(ep);
	let tpP = await initprob(tp);

	const bops = { verbose: true };
	let likelihood_prev = 0;
	let cont = true;
	while (cont) {
		cont = false;

		let likelihood = 0;
		const resultsF = await forward(obs, states, spP, tpP, epP, bops);
		const resultsB = await backward(obs, states, spP, tpP, epP, bops);
		const epPT = await resetprob(epP);
		const tpPT = await resetprob(tpP);

		for (let i = 0; i < obs.length - 1; i++) {
			const fr = resultsF["Tss"][i];
			const br = resultsB["Tss"][i];
			const fr1 = resultsF["Tss"][i + 1];
			const br1 = resultsB["Tss"][i + 1];
			const scale = fr1[states[0]]["tS"] * br1[states[0]]["tS"];

			for (const st1 of states) {
				const fp = fr[st1]["variable"];
				const bp = br[st1]["variable"];
				epPT[st1][obs[i]] += fp * bp;
				for (const st2 of states) {
					const bp1 = br1[st2]["variable"];
					tpPT[st1][st2] += fp * tpP[st1][st2] * epP[st2][obs[i + 1]] * bp1 / scale;
				}
			}
			likelihood += Math.log(scale);
		}
		epP = await ratio2prob(epPT);
		tpP = await ratio2prob(tpPT);
		const diff = (likelihood_prev - likelihood) / likelihood_prev * 100;
		if (Math.pow(0.1, 6) < diff) {
			likelihood_prev = likelihood;
			cont = true;
		}
	}

	const result = {};
	if (options.method === 'hw') {
		const {
			path
		} = await viterbi(obs, states, spP, tpP, epP);
		let correct = 0;
		for (let i = 0; i < path.length; i++) {
			if (path[i] === actual_path[i]) correct++;
		}
		result.match = correct / path.length;
	}

	return {
		input: {
			length: length
		},
		actual_model: {
			trans_prob: tp,
			emiss_prob: ep
		},
		model: {
			trans_prob: tpP,
			emiss_prob: epP
		},
		result: result
	}
}

module.exports = calc;
