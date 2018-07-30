function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

async function initprob(probI) {
    const convert = async function (probI) {
        const prob = {};
        let sum = 0;
        for (const key in probI) {
            const el = probI[key];
            let item;
            if (Array.isArray(el) || isObj(el)) {
                item = await convert(el);
                prob[key] = item;
            } else {
                sum += 1;
            }
        }
        if (sum !== 0) {
            for (const key in probI) {
                const el = probI[key];
                if (!Array.isArray(el) && !isObj(el)) {
                    prob[key] = el / sum;
                }
            }
        }
        return prob;
    };
    const prob = await convert(probI);
    return prob;
}

module.exports = initprob;
