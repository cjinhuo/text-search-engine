export function getBasicOutput({ name, version }) {
	const annotation = `/* ${name} version:${version} */`
	return {
		banner: annotation,
		footer: '/* follow me on Github! @cjinhuo */',
		globals: {},
	}
}
