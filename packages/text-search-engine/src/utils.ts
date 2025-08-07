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
 * Check if the strictness coefficient is satisfied for search results
 * @param strictnessCoefficient The strictness coefficient (recommended range: 0-1 decimal).
 *                              Lower values mean stricter matching. Values > 1 will be clamped to 1.
 * @param target The target string being searched
 * @param rawHitRanges The raw hit ranges found in the search
 * @returns boolean indicating whether the strictness requirement is satisfied
 */
export function isStrictnessSatisfied(strictnessCoefficient: number, target: string, rawHitRanges: Matrix) {
	// Clamp strictnessCoefficient to range [0.1, 1] (recommended range: 0-1)
	const clampedCoefficient = Math.min(Math.max(strictnessCoefficient, 0.1), 1)
	const maxHitLength = Math.ceil(clampedCoefficient * target.length)
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
 * 判断命中字符串是否为连续单词
 * @param target 匹配字符串
 * @param source 源字符串
 * @returns 如果英文连续则返回 true，否则返回 false
 *
 */
export const isConsecutiveForChar = (
	source: string,
	target: string,
	wordHitRangesMapping: Record<number, Matrix>,
	rawHitRanges?: Matrix
): boolean => {
	let _hitRangesLength = rawHitRanges?.length || 0
	// 未命中
	if (!rawHitRanges || rawHitRanges?.length === 0) {
		return false
	}
	// 连续命中
	if (rawHitRanges.length === 1) {
		return true
	}

	const queryWord = target.trim().toLowerCase().split(/\s+/)
	let _queryWordLength = queryWord.length

	for (const [index, _] of queryWord.entries()) {
		const hitIndices = wordHitRangesMapping[index]
		// hitIndices：当前word，命中的索引
		if (hitIndices) {
			let isTargetAllChinese = true
			for (const [start, end] of hitIndices) {
				const substring = source.slice(start, end + 1).toLowerCase()
				if (!isAllChinese(substring)) {
					isTargetAllChinese = false
				} else {
					// hitRange中索引对应source是全中文，_hitRangesLength--
					_hitRangesLength--
				}
			}
			// 如果当前target word命中的source word都是中文，_queryWordLength--
			if (isTargetAllChinese) {
				_queryWordLength--
			}
		}
	}

	return _queryWordLength >= _hitRangesLength
}
