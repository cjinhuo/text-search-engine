export function getHighlightText(str: string) {
	return `\x1b[32m${str}\x1b[0m`
}

export function highlightTextWithRanges(str: string, ranges: [number, number][]) {
	const result: string[] = []
	let index = 0

	for (const range of ranges) {
		const [start, end] = range

		if (index < start) {
			result.push(str.slice(index, start))
		}

		result.push(getHighlightText(str.slice(start, end + 1)))
		index = end + 1
	}

	if (index < str.length) {
		result.push(str.slice(index))
	}

	return result.join('')
}

// 10 => [[2, 3], [3, 4], [5, 6]] => [[0, 2] [3, 5], [6, 10]]
// export function diffRanges(totalLength: number, ranges: [number, number][]): [number, number][] {
// 	if (ranges.length === 0) return [[0, totalLength]]
// 	const sortedRanges = ranges.sort((a, b) => a[0] - b[0])
// 	let prevStart = sortedRanges[0][0]
// 	let prevEnd = sortedRanges[0][1]
// 	for (let i = 1; i < sortedRanges.length; i++) {}
// }
