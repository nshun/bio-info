function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

async function convert2log(list2log) {
	const convert = async function (list) {
		const loglist = [];
		for (const key in list) {
			const el = list[key];
			const logitem = isArray(el) ?
				await convert(el) : isFinite(el) ? Math.log(el) : el;
			loglist[key] = logitem;
		}
		return loglist;
	};
	loglist = await convert(list2log);
	for (const key in list2log) {
		list2log[key] = loglist[key];
	}
}

module.exports = convert2log;
