function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

async function convert2log(list2exp) {
	const convert = async function (list) {
		const explist = [];
		for (const key in list) {
			const el = list[key];
			const expitem = isArray(el) ?
				await convert(el) : isFinite(el) ? Math.exp(el) : el;
			explist[key] = expitem;
		}
		return explist;
	};
	const explist = await convert(list2exp);
	return explist;
}

module.exports = convert2log;
