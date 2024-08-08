import { getBoundary } from './boundary'
import type { BoundaryData } from './types'
import { highlightTextWithRanges } from './utils'

/**
 * return the hit indices with the boundary data
 * @param data the processed data of `getBoundary` which records the mapping relationship between letters, pinyin, and Chinese characters
 * @param target the string by user input
 * @returns the hit indices
 */
export function search(data: BoundaryData, target: string) {
	const { pinyinString, boundary } = data
	const targetLength = target.length
	const pinyinLength = pinyinString.length
	if (!data || !target || pinyinLength < targetLength) return undefined

	const matchPositions = Array(targetLength).fill(-1)

	let matchIndex = 0
	for (let i = 0; i < pinyinLength && matchIndex < targetLength; i++) {
		if (pinyinString[i] === target[matchIndex]) {
			matchPositions[matchIndex++] = i
		}
	}

	// 如果输入字符小于匹配到的字符，判定无效
	if (matchIndex < targetLength) return undefined

	const defaultDpTableValue = [0, 0, -1, -1]
	// x你 => x你ni target = ni
	// n => [1, 1, xx, xx] i => [1, 2, xx, xx]
	// [匹配字符个数：一个汉字算一个字符，统计当前已匹配的字符个数， 匹配字母个数：一个拼音中的一个字母算一个，统计当前已匹配的字母数， 原始字符串的开始位置, 原始字符串的结束位置]
	const dpTable = Array.from({ length: pinyinLength + 1 }, () => defaultDpTableValue)
	const dpScores = Array(pinyinLength + 1).fill(0)
	const dpMatchPath = Array.from({ length: pinyinLength + 1 }, () => Array(targetLength))

	// matchIndex 和上面的 matchIndex 表示同一个意思，所以取同样的名字
	for (let matchIndex = 0; matchIndex < matchPositions.length; matchIndex++) {
		// 表示匹配字符在 pinyinString 中的开始位置，可能后面也有相同字符，需要遍历至结尾，来计算连续匹配的个数
		// 如果统一默认都从 0 开始，会有个不优雅的地方：在第 0 个获取 0 - 1 时需要判空，所以这里统一从 1 开始
		let matchedPinyinIndex = matchPositions[matchIndex] + 1

		// todo output only in debug mode
		// console.log('outer for letter:', pinyinString[matchedPinyinIndex - 1])

		let currentDpTableItem = dpTable[matchedPinyinIndex - 1]
		let currentScore = dpScores[matchedPinyinIndex - 1]
		// 上面缓存完，立即重置上一次的 dptable 和 score，避免影响下一次循环的计算，可以理解成消耗掉上一次的 dptable 和 score
		// 如 nonod, 输入 nod，首次遍历 n 时，score 为 [1, 0, 1, 0, d], 遍历 o 时，score 为 [0, 1*2+1, 0, 1*2+1, 0], 遍历 d 时，score 为 [0, 1*2+1, 0, 0, 2*2+1]
		dpScores[matchedPinyinIndex - 1] = 0
		dpTable[matchedPinyinIndex - 1] = defaultDpTableValue

		for (; matchedPinyinIndex <= pinyinLength; matchedPinyinIndex++) {
			// todo output only in debug mode
			// console.log('inner for letter:', pinyinString[matchedPinyinIndex - 1])
			let prevScore = currentScore
			// string => 一个字符，如一个汉字或一个英文
			// letter => 一个拼音中的一个字母
			const [prevMatchedStrings, prevMatchedLetters, prevBoundaryStart, prevBoundaryEnd] = currentDpTableItem
			// 提前缓存未计算的 score 和 dptable 作为下一次的判断，因为当前 for 循环会从命中的下标遍历至结尾，例如 noo，输入 no，首次遍历 o 时拿到 n 的 dpTable [1, 1, 0, 0]，遍历第二个 o 时应拿到 [0, 0, -1, -1]，而不是 [2, 2, 1, 1]，只有在上面首次遍历才缓存了上一次的 dpTable 和 score
			// score 也是如此，例如 noo，输入 no，首次遍历 o 时拿到 n 的 score 1，遍历第二个 o 时应拿到 0，而不是 3
			currentDpTableItem = dpTable[matchedPinyinIndex]
			currentScore = dpScores[matchedPinyinIndex]

			// 的dedi 的 =>[x, y] d => [x, y+1] e => [x, y+1] d => [x, y+2] di => [x, y+2]
			const isNewWord =
				matchedPinyinIndex - 1 === boundary[matchedPinyinIndex][1] &&
				prevBoundaryStart !== boundary[matchedPinyinIndex][0]

			// for pinyin：是否是连续匹配的首字母
			// todo 暴露这个开关，是否只匹配l连续的字符或汉字
			const isContinuation =
				prevMatchedStrings > 0 &&
				// 适配多音字，比如“的” dedi，匹配到 de 后不会再匹配 di
				prevBoundaryEnd === boundary[matchedPinyinIndex][1] &&
				// 判断当前字母是否在拼音中时连续的，比如 hua，输入 ha，遍历 a 时需要判断 a 前面一个是不是 u，不是则 false
				pinyinString[matchedPinyinIndex - 2] === target[matchIndex - 1]
			const isEqual = pinyinString[matchedPinyinIndex - 1] === target[matchIndex]

			if (isEqual && (isNewWord || isContinuation)) {
				prevScore += prevMatchedLetters * 2 + 1

				const matchedLettersCount = prevMatchedLetters + 1
				// 只有 大于等于 前一次分数才更新元素状态，比如： no_node, 输入 nod 匹配到后面的 nod
				if (prevScore >= dpScores[matchedPinyinIndex - 1]) {
					dpScores[matchedPinyinIndex] = prevScore
					// prevMatchedStrings + ~~isNewWord:连续匹配的字符个数
					dpTable[matchedPinyinIndex] = [
						prevMatchedStrings + ~~isNewWord,
						matchedLettersCount,
						boundary[matchedPinyinIndex][0],
						boundary[matchedPinyinIndex][1],
					]
				}

				// 只有 大于 才需要替换 dpMatchPath，不然就命中前面，比如 no_no 输入 no 命中第一次的 no
				if (prevScore > dpScores[matchedPinyinIndex - 1]) {
					// 原始字符串对应的下标
					const originalStringIndex = boundary[matchedPinyinIndex][0]
					// 首字母时 prevMatchedStrings = 0，不是首字母时应该加 1，下标才能对的上
					dpMatchPath[matchedPinyinIndex][matchIndex] = [
						originalStringIndex - prevMatchedStrings + ~~!isNewWord,
						originalStringIndex,
						matchedLettersCount,
					]
				} else {
					dpMatchPath[matchedPinyinIndex][matchIndex] = dpMatchPath[matchedPinyinIndex - 1][matchIndex]
				}
				continue
			}

			dpScores[matchedPinyinIndex] = dpScores[matchedPinyinIndex - 1]
			dpMatchPath[matchedPinyinIndex][matchIndex] = dpMatchPath[matchedPinyinIndex - 1][matchIndex]
			// 当前匹配与上一个匹配的 gap ，比如 abc, 第一次是 a 第二次是 b，gap = 1,第一次 a 第二次是 c ，gap = 2，
			// 这里指的是原文，而不是 pinyin，比如 c测试，假如 c 已经命中了，那么“测“和 c 的 gap 为 1，复用 dpTable 中的值
			const gap = boundary[matchedPinyinIndex][0] - dpTable[matchedPinyinIndex - 1][2]
			// 表示下一个字符的拼音对应还是当前汉字, 比如 试shi, s 和 h 都对应 "试" 的下标
			const isSameWord = () => boundary[matchedPinyinIndex][0] === boundary[matchedPinyinIndex + 1][0]
			const isWithInRange = matchedPinyinIndex < pinyinLength - 1
			dpTable[matchedPinyinIndex] =
				gap === 0 || (isWithInRange && gap === 1 && isSameWord())
					? dpTable[matchedPinyinIndex - 1]
					: defaultDpTableValue
		}
	}

	if (dpMatchPath[pinyinLength][targetLength - 1] === undefined) return undefined

	const hitIndices: [number, number][] = []
	for (let i = targetLength - 1; i >= 0; ) {
		const [start, end, matchedLetters] = dpMatchPath[pinyinLength][i]
		hitIndices.unshift([start, end])
		i -= matchedLetters
	}
	return hitIndices
}

const originalString = '黑悟空神话 black'
const input = 'heiwh'
console.time('search')
const hitIndices = search(getBoundary(originalString), input.toLocaleLowerCase())
console.timeEnd('search')
console.log('hitIndices', hitIndices)
console.log('original string:', originalString, 'input:', input)
if (hitIndices) {
	console.log(highlightTextWithRanges(originalString, hitIndices))
}
