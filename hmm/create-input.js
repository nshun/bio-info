const st_keys = [];
const ep_keys = [];

async function getRandValue(prob, key) {
    let value = Math.random();
    let i = -1;
    while (0 < value) {
        value -= prob[key[++i]];
    }
    return key[i];
}

async function nextRound(now_state, tp, ep) {
    const observ = await getRandValue(ep[now_state], ep_keys[now_state]);
    const next_state = await getRandValue(tp[now_state], st_keys);
    return {
        observ: observ,
        next_state: next_state
    };
}

async function create(states, sp, tp, ep, length) {
    const observs = [];
    const path = [];

    for (const st of states) {
        st_keys.push(st);
        ep_keys[st] = Object.keys(ep[st]);
    }

    let now_state = await getRandValue(sp, st_keys);
    const first_observ = await getRandValue(ep[now_state], ep_keys[now_state]);
    observs.push(first_observ);
    path.push(now_state);

    for (let i = 0; i < length - 1; i++) {
        const result = await nextRound(now_state, tp, ep);
        now_state = result["next_state"];
        observs.push(result["observ"]);
        path.push(now_state);
    }

    return {
        observations: observs.join(''),
        actual_path: path.join('')
    }
}

module.exports = create;
