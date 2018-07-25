function logsumexp2(a, b) {
    return b + Math.log(Math.exp(a - b) + 1);
}

function logsumexp(_arr) {
    const arr = _arr;
    while (1 < arr.length) {
        arr[0] = logsumexp2(arr[0], arr.pop());
    }
    return arr[0];
}
module.exports = logsumexp;
