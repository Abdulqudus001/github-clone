const units = [
	{ name: ' second', value: 1000, max: 50, single: 'a second' },
	{ name: ' minute', value: 60000, max: 50, single: 'a minute' },
	{ name: ' hour', value: 3600000, max: 22, single: 'an hour' },
	{ name: ' day', value: 86400000, max: 6, single: 'a day' },
	{ name: ' week', value: 604800000, max: 3.5, single: 'a week' },
	{ name: ' month', value: 2592000000, max: 11, single: 'a month' },
	{ name: ' year', value: 31536000000, max: Infinity, single: 'a year' }
];

const format = date => {
	let diff = Date.now() - date.getTime();

	const future = diff < 0;
	diff = Math.abs(diff);

	if (!future && diff < 10000) return 'just now';
	if (future && diff < 5000) return 'any second';

	const suffix = future ? ' from now' : ' ago';

	for (let i = 0; i < units.length; i++) {
		const unit = units[i];

		if (diff <= unit.max * unit.value) {
			const t = Math.round(diff / unit.value);
			return t === 1 ? unit.single + suffix : t + unit.name + 's' + suffix;
		}
	}
};