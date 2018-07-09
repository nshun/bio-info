const arr2obj = require('../arr2obj');
const forward = require('./forward-log');
const backward = require('./backward-log');

async function posterior(observs, states, sp, tp, ep) {
    const path = [];
    const options = {
        verbose: true
    }
    const result_for = await forward(observs, states, sp, tp, ep, options);
    const result_back = await backward(observs, states, sp, tp, ep, options);
    for (let i = 0; i < result_for["Tss"].length; i++) {
        const forward_prob = result_for["Tss"][i];
        const backward_prob = result_back["Tss"][i];
        let max_prob = 0;
        let max_label = '';
        for (const state of states) {
            const merged_prob = forward_prob[state]["prob"]; //* backward_prob[state]["prob"];
            if (max_prob < merged_prob) {
                max_prob = merged_prob;
                max_label = state;
            }
        }
        path.push(max_label);
    }
    return {
        path: path.join('')
    }
}

module.exports = posterior;
