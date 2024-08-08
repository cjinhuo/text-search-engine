export function getGlobFilter(fitlerString) {
	if (!fitlerString) return ''
	const args = fitlerString.split(',')
	if (args.length === 1) return `${args.pop()}*`
	return `{${args}}*`
}
