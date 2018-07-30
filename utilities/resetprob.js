function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

async function resetprob(probI) {
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
                prob[key] = 0;
            }
        }
        return prob;
    };
    const prob = await convert(probI);
    return prob;
}

module.exports = resetprob;
