const ratio2prob = require('@utilities/ratio2prob');
const hmm_main = require('@hmm/main');
const createInput = require('@hmm/create-input');

function average(arr) {
    let sum = 0;
    for (const val of arr) {
        sum += val;
    }
    return sum / arr.length;
}

async function runOnce(base_options) {
    const viterbi_result = await hmm_main(Object.assign({ method: 'viterbi' }, base_options));
    const posteri_result = await hmm_main(Object.assign({ method: 'posterior-decoding' }, base_options));
    return {
        viterbi_match: viterbi_result["output"]["match"],
        posteri_match: posteri_result["output"]["match"]
    }
}

async function compare(options) {
    const {
        states,
        start_ratio,
        trans_ratio,
        emiss_ratio
    } = require('@src/example-hmm-model');
    const start_prob = await ratio2prob(start_ratio);
    const trans_prob = await ratio2prob(trans_ratio);
    const emiss_prob = await ratio2prob(emiss_ratio);

    const loop = options && options.loop ? parseInt(options.loop) : 100;
    const length = options && options.length ? parseInt(options.length) : 10000;
    const viterbi_matches = [];
    const posteri_matches = [];

    for (let i = 0; i < loop; i++) {
        const input = await createInput(states, start_prob, trans_prob, emiss_prob, length);
        const base_options = {
            model: require('@src/example-hmm-model'),
            input: input
        }
        const resultOne = await runOnce(base_options);
        viterbi_matches.push(resultOne["viterbi_match"]);
        posteri_matches.push(resultOne["posteri_match"]);
    }
    return {
        result: {
            loop: viterbi_matches.length,
            length: length,
            viterbi_matches_avg: average(await viterbi_matches),
            posteri_matches_avg: average(await posteri_matches)
        }
    }
}

module.exports = compare;
