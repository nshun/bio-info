const fs = require('fs');
const p = require('path');
const ratio2prob = require('@utilities/ratio2prob');
const createInput = require('./create-input');

async function calc(opitons) {
	const {
		states,
		start_ratio,
		trans_ratio,
		emiss_ratio
	} = opitons.model ? opitons.model : require('../src/example-hmm-model');
	const start_prob = await ratio2prob(start_ratio);
	const trans_prob = await ratio2prob(trans_ratio);
	const emiss_prob = await ratio2prob(emiss_ratio);

	const {
		observations,
		actual_path
	} = opitons.input ? opitons.input : require('../src/example-hmm-input');


	const methodpath = p.resolve(opitons.method ?
		`./hmm/${opitons.method}.js` : `./hmm/viterbi.js`);
	if (!fs.existsSync(methodpath) || !fs.statSync(methodpath).isFile())
		return Promise.reject(new Error(`method=${opitons.method} is not found.`));
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
