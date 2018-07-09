async function arr2obj(arr) {
    const convert = async function (arr) {
        const obj = {};
        for (const key in arr) {
            const el = arr[key];
            const objitem = Array.isArray(el) ? await convert(el) : el;
            obj[key] = objitem;
        }
        return obj;
    };
    const obj = await convert(arr);
    return obj;
}

module.exports = arr2obj;
