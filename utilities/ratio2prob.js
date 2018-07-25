function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

async function ratio2prob(ratio) {
    const convert = async function (ratio) {
        const prob = {};
        let sum = 0;
        for (const key in ratio) {
            const el = ratio[key];
            let item;
            if (Array.isArray(el) || isObj(el)) {
                item = await convert(el);
                prob[key] = item;
            } else {
                sum += el;
            }
        }
        if (sum !== 0) {
            for (const key in ratio) {
                const el = ratio[key];
                if (!Array.isArray(el) && !isObj(el)) {
                    prob[key] = el / sum;
                }
            }
        }
        return prob;
    };
    const prob = await convert(ratio);
    return prob;
}

module.exports = ratio2prob;
