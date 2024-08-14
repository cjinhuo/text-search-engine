import type { Matrix } from './types'

export function getHighlightText(str: string) {
	return `\x1b[32m${str}\x1b[0m`
}

export function highlightTextWithRanges(str: string, ranges: Matrix) {
	const result: string[] = []
	let index = 0

	for (const range of ranges.sort((a, b) => a[0] - b[0])) {
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

/**
 * calculate the rest ranges. eg: 10 => [[2, 3], [3, 5], [7, 9]] => [[0, 2] [4, 5], [6, 10]]
 * @param {number} totalLength
 * @param {Matrix} ranges
 * @returns {Matrix}
 */
export function getRestRanges(totalLength: number, ranges: Matrix): Matrix {
	if (ranges.length === 0) {
		return [[0, totalLength]]
	}
	ranges.sort((a, b) => a[0] - b[0])

	const restRanges: Matrix = []
	let currentStart = 0

	for (let i = 0; i < ranges.length; i++) {
		const [start, end] = ranges[i]
		if (currentStart < start) {
			restRanges.push([currentStart, start])
		}
		//set “end + 1" since there use the closed interval in search function
		currentStart = Math.max(currentStart, end + 1)
	}

	if (currentStart < totalLength) {
		restRanges.push([currentStart, totalLength])
	}
	return restRanges
}

export function isString(o: unknown): o is string {
	return typeof o === 'string'
}

export function isEmptyString(str: unknown) {
	if (!isString(str)) {
		throw 'input need to be a string'
	}
	return !str.trim().length
}
