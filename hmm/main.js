const fs = require('fs');
const p = require('path');
const ratio2prob = require('@utilities/ratio2prob');

async function calc(options) {
	if (options.method === 'compare') {
		const calc = require('@hmm/compare');
		return await calc(options);
	}

	const methodpath = p.resolve(options.method ? `./hmm/${options.method}.js` : `./hmm/viterbi.js`);
	if (!fs.existsSync(methodpath) || !fs.statSync(methodpath).isFile())
		return Promise.reject(new Error(`method=${options.method} is not found.`));

	const {
		states,
		start_ratio,
		trans_ratio,
		emiss_ratio
	} = options.model ? options.model : require('@src/example-hmm-model');
	const start_prob = await ratio2prob(start_ratio);
	const trans_prob = await ratio2prob(trans_ratio);
	const emiss_prob = await ratio2prob(emiss_ratio);

	const {
		observations,
		actual_path
	} = options.input ? options.input : require('@src/example-hmm-input');

	const calc = require(methodpath);
	const result = await calc(observations.split(''), states,
		start_prob, trans_prob, emiss_prob);

	if (result && result["path"]) {
		const pathT = actual_path.split('');
		const pathE = result["path"].split('');
		let correct_cnt = 0;
		for (let i = 0; i < pathT.length; i++) {
			if (pathT[i] === pathE[i]) correct_cnt++;
		}
		result["match"] = correct_cnt / pathT.length;
	}

	return {
		input: {
			observations: observations,
			actual_path: actual_path
		},
		output: result
	}
}

module.exports = calc;
