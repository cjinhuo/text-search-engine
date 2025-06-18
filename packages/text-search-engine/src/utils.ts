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
		//set "end + 1" since there use the closed interval in search function
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

/**
 * merge all blank spaces within hit ranges
 * @param source required, the source string you want to search
 * @param rawHitRanges required
 * @returns
 */
export function mergeSpacesWithRanges(source: string, rawHitRanges: Matrix) {
	if (rawHitRanges.length === 1) return rawHitRanges
	const hitRanges: Matrix = [rawHitRanges[0]]
	let [lastStart, lastEnd] = rawHitRanges[0]
	for (let i = 1; i < rawHitRanges.length; i++) {
		const [start, end] = rawHitRanges[i]
		const gap = source.slice(lastEnd + 1, start)

		// between two ranges, there is a blank space
		if (!gap.trim().length) {
			hitRanges[hitRanges.length - 1] = [lastStart, end]
		} else {
			lastStart = start
			hitRanges.push([start, end])
		}
		lastEnd = end
	}
	return hitRanges
}

/**
 * check if the strictness coefficient is satisfied
 * @param strictnessCoefficient
 * @param target
 * @param rawHitRanges
 * @returns boolean
 */
export function isStrictnessSatisfied(strictnessCoefficient: number, target: string, rawHitRanges: Matrix) {
	const maxHitLength = Math.ceil(Math.abs(strictnessCoefficient) * target.length)
	return maxHitLength >= rawHitRanges.length
}

/**
 * 只有本地调试时运行的代码，打包和跑单测时跳过的代码
 * @param fn 测试运行的代码
 * @returns
 */
export const debugFn = (fn: () => void) => {
	if (process.env.NODE_ENV === 'test') return
	fn()
}

const ALL_CHINESE_REGEX = /^[\u4e00-\u9fff]+$/

export const isAllChinese = (str: string): boolean => {
	if (!str.length) return false
	if (str.length <= 6) {
		for (let i = 0; i < str.length; i++) {
			const code = str.charCodeAt(i)
			if (code < 0x4e00 || code > 0x9fff) {
				return false
			}
		}
		return true
	}
	return ALL_CHINESE_REGEX.test(str)
}

/**
 *
 * @param target 匹配字符串
 * @param source 源字符串
 * @returns 如果英文连续则返回原始 ranges，否则返回 undefined
 *
 */
export const isContinuousLatin = (source: string, target: string, rawHitRanges?: Matrix): Matrix | undefined => {
	let _hitRangesLength = rawHitRanges?.length || 0
	// 未命中
	if (!rawHitRanges || rawHitRanges?.length === 0) {
		return undefined
	}
	// 连续命中
	if (rawHitRanges.length === 1) {
		return rawHitRanges
	}
	// 从rawHitRanges中删除 源字符串是非英文的
	for (const [start, end] of rawHitRanges) {
		const substring = source.slice(start, end + 1).toLowerCase()
		if (isAllChinese(substring)) {
			_hitRangesLength--
		}
	}
	const queryWordLength = target
		.trim()
		.split(/\s+/)
		.filter((w) => !isAllChinese(w))
	return queryWordLength.length >= _hitRangesLength ? rawHitRanges : undefined
}
