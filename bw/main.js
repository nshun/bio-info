const ratio2prob = require('@utilities/ratio2prob');
const createInput = require('@hmm/create-input');
const forward = require('@hmm/forward-log');
const backward = require('@hmm/backward-log');

async function calc(options) {
	const {
		states,
		start_ratio,
		trans_ratio,
		emiss_ratio
	} = options.model ? options.model : require('@src/example-hmm-model-bw');

	const sp = await ratio2prob(start_ratio);
	const tp = await ratio2prob(trans_ratio);
	const ep = await ratio2prob(emiss_ratio);

	const length = options && options.length ? parseInt(options.length) : 300;

	const {
		observations,
		actual_path
	} = createInput(states, sp, tp, ep, length);

	const options = {
		verbose: true
	}
	const result_for = await forward(observations, states, sp, tp, ep, options);
	const result_back = await backward(observations, states, sp, tp, ep, options);

	for (let i = 0; i < result_for["Tss"].length; i++) {
		const forward_prob = result_for["Tss"][i];
		const backward_prob = result_back["Tss"][i];
		let max_prob;
		let max_label = '';
		for (const state of states) {
			const merged_prob = forward_prob[state]["variable"] + backward_prob[state]["variable"];
			if (max_prob === undefined || max_prob < merged_prob) {
				max_prob = merged_prob;
				max_label = state;
			}
		}
		path.push(max_label);
	}

	return {
		actual_model: {
			trans_prob: tp,
			emiss_prob: ep
		},
		model: {
			trans_prob: tp,
			emiss_prob: ep
		}
	}
}

module.exports = calc;
