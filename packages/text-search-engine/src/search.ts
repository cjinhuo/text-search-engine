import { extractBoundaryMappingWithPresetPinyin } from './boundary'
import type { Matrix, SourceMappingData } from './types'
import { debugFn, getRestRanges, highlightTextWithRanges, isConsecutiveForChar, mergeSpacesWithRanges } from './utils'

/**
 * return the hit indices with the boundary data
 * @param data the processed data of `extractBoundaryMapping` which records the mapping relationship
 *             between letters, pinyin, and Chinese characters
 * @param target only could be a single word which can't include space or special characters
 * @returns the hit indices
 */
export function searchByBoundaryMapping(data: SourceMappingData, target: string, startIndex: number, endIndex: number) {
	const { originalLength, originalIndices } = data
	const pinyinString = data.pinyinString.slice(originalIndices[startIndex], originalIndices[endIndex])
	const boundary = data.boundary.slice(originalIndices[startIndex], originalIndices[endIndex] + 1)
	const targetLength = target.length
	const pinyinLength = pinyinString.length
	if (!data || !target || pinyinLength < targetLength || !originalLength) return undefined

	// use to restore the real index
	const startBoundary = boundary[1][0]
	const endBoundary = boundary[1][1]

	const matchPositions: number[] = Array(targetLength).fill(-1)

	let _matchIndex = 0
	for (let i = 0; i < pinyinLength && _matchIndex < targetLength; i++) {
		if (pinyinString[i] === target[_matchIndex]) {
			matchPositions[_matchIndex++] = i
		}
	}

	// it would be invalid if the input character is smaller than the matched character
	if (_matchIndex < targetLength) return undefined

	const defaultDpTableValue = [0, 0, -1, -1]
	// x你 => x你ni target = ni
	// n => [1, 1, xx, xx] i => [1, 2, xx, xx]
	const dpTable = Array.from({ length: pinyinLength + 1 }, () => defaultDpTableValue)
	const dpScores: number[] = Array(pinyinLength + 1).fill(0)
	const dpMatchPath: [number, number, number][][] = Array.from({ length: pinyinLength + 1 }, () => Array(targetLength))

	// 添加遍历次数统计
	let totalLoopCount = 0

	for (let matchIndex = 0; matchIndex < matchPositions.length; matchIndex++) {
		// If the array index start from 0, then when accessing the 0th element to get 0 - 1,
		// we need to check for null. Therefore, uniformly start from 1.
		let matchedPinyinIndex = matchPositions[matchIndex] + 1

		debugFn(() => {
			console.log('outer for letter:', pinyinString[matchedPinyinIndex - 1], 'matchedPinyinIndex', matchedPinyinIndex)
		})

		let currentDpTableItem = dpTable[matchedPinyinIndex - 1]
		let currentScore = dpScores[matchedPinyinIndex - 1]
		// cache the last time of dpTable and score and reset it immediately, avoid affecting the next calculation.
		// It can be understood as consuming the last time's dpTable and score
		// source: nonod, input: nod
		// first iterate n, score is [1, 0, 1, 0, d]
		// then iterate o, score is [0, 1*2+1, 1*2+1, 1*2+1, 1*2+1]
		// then iterate d, score is [0, 1*2+1, 1*2+1, 1*2+1, 2*2+1]
		dpScores[matchedPinyinIndex - 1] = 0
		dpTable[matchedPinyinIndex - 1] = defaultDpTableValue

		// 标记是否找到当前字符的有效匹配
		let foundValidMatchForCurrentChar = false
		for (; matchedPinyinIndex <= pinyinLength; matchedPinyinIndex++) {
			totalLoopCount++

			debugFn(() => {
				console.log('inner for letter:', pinyinString[matchedPinyinIndex - 1])
			})
			let prevScore = currentScore
			// character => a chinese character or a latin
			// letter => a letter of pinyin
			const [prevMatchedCharacters, prevMatchedLetters, prevBoundaryStart, prevBoundaryEnd] = currentDpTableItem
			// 提前缓存未计算的 score 和 dptable 作为下一次的判断，因为当前 for 循环会从命中的下标遍历至结尾
			// 例如 noo，输入 no，首次遍历 o 时拿到 n 的 dpTable [1, 1, 0, 0]，遍历第二个 o 时应拿到 [0, 0, -1, -1]，
			// 而不是 [2, 2, 1, 1]，只有在上面首次遍历才缓存了上一次的 dpTable 和 score
			// eg: source: 'noo', input: 'no', the first time iterate the first 'o', score is 1,
			// then iterate the second 'o', score should be 0 instead of 3
			currentDpTableItem = dpTable[matchedPinyinIndex]
			currentScore = dpScores[matchedPinyinIndex]

			// 的dedi 的 =>[x, y] d => [x, y+1] e => [x, y+1] d => [x, y+2] di => [x, y+2]
			const isNewWord =
				matchedPinyinIndex - 1 === boundary[matchedPinyinIndex][1] - endBoundary &&
				prevBoundaryStart !== boundary[matchedPinyinIndex][0] - startBoundary

			// for pinyin：是否是连续匹配的首字母
			// todo 暴露这个开关，是否只匹配连续的字符或汉字
			const isContinuation =
				prevMatchedCharacters > 0 &&
				// 适配多音字，比如"的" dedi，匹配到 de 后不会再匹配 di
				prevBoundaryEnd === boundary[matchedPinyinIndex][1] - endBoundary &&
				// 判断当前字母是否在拼音中是连续，如 hua，输入 ha，遍历 a 时需判断 a 前面一个是不是 u，不是则 false
				pinyinString[matchedPinyinIndex - 2] === target[matchIndex - 1]
			const isEqual = pinyinString[matchedPinyinIndex - 1] === target[matchIndex]

			// 除了第一次进来，只有上一个得分大于 0 时才进入
			// 比如 chen,输入 ce，遍历 e 时如前面的 h 不是连续的，得分为 0 即 skip
			if (isEqual && (isNewWord || isContinuation) && (matchIndex === 0 || prevScore > 0)) {
				prevScore += prevMatchedLetters * 2 + 1

				const matchedLettersCount = prevMatchedLetters + 1
				// only update the state when the score is greater than or equal to the previous score
				// for example, source: 'no_node', input: 'nod', it will match the second 'n'.(no_'nod'e)
				if (prevScore >= dpScores[matchedPinyinIndex - 1]) {
					dpScores[matchedPinyinIndex] = prevScore
					// prevMatchedCharacters + ~~isNewWord:means the count of continuous matched characters
					dpTable[matchedPinyinIndex] = [
						prevMatchedCharacters + ~~isNewWord,
						matchedLettersCount,
						boundary[matchedPinyinIndex][0] - startBoundary,
						boundary[matchedPinyinIndex][1] - endBoundary,
					]

					const originalStringIndex = boundary[matchedPinyinIndex][0] - startBoundary
					// 只有 大于 才需要替换 dpMatchPath，不然就命中前面，比如 no_no 输入 no 命中第一次的 no
					const newMatched = prevScore > dpScores[matchedPinyinIndex - 1]
					dpMatchPath[matchedPinyinIndex][matchIndex] = newMatched
						? // 首字母时 prevMatchedCharacters = 0，不是首字母时应该加 1
							[originalStringIndex - prevMatchedCharacters + ~~!isNewWord, originalStringIndex, matchedLettersCount]
						: dpMatchPath[matchedPinyinIndex - 1][matchIndex]
					// 当前字符遍历一遍，如果都没有进入当前 if 分支说明没有匹配到，在外层即可 return
					// issue: https://github.com/cjinhuo/text-search-engine/issues/21
					foundValidMatchForCurrentChar = true
					continue
				}
			}

			dpScores[matchedPinyinIndex] = dpScores[matchedPinyinIndex - 1]
			dpMatchPath[matchedPinyinIndex][matchIndex] = dpMatchPath[matchedPinyinIndex - 1][matchIndex]
			// 当前匹配与上一个匹配的 gap，比如 abc, 第一次是 a 第二次是 b，gap = 1,第一次 a 第二次是 c，gap = 2
			// 这里指的是原文，而不是 pinyin，比如 c测试，假如 c 已经命中了，那么"测"和 c 的 gap 为 1，复用 dpTable 中的值
			const gap = boundary[matchedPinyinIndex][0] - startBoundary - dpTable[matchedPinyinIndex - 1][2]
			// 表示下一个字符的拼音对应还是当前汉字, 比如 试shi, s 和 h 都对应 "试" 的下标
			const isSameWord = () => boundary[matchedPinyinIndex][0] === boundary[matchedPinyinIndex + 1][0]
			const isWithInRange = matchedPinyinIndex < pinyinLength - 1
			dpTable[matchedPinyinIndex] =
				gap === 0 || (isWithInRange && gap === 1 && isSameWord())
					? dpTable[matchedPinyinIndex - 1]
					: defaultDpTableValue
		}
		if (!foundValidMatchForCurrentChar) {
			debugFn(() => {
				console.log('not found valid match for current char, matchedPinyinIndex', matchedPinyinIndex)
				console.log(`total loop count: ${totalLoopCount}`)
			})
			return undefined
		}
	}

	debugFn(() => {
		console.log(`total loop count: ${totalLoopCount}`)
	})

	if (dpMatchPath[pinyinLength][targetLength - 1] === undefined) return undefined
	const hitIndices: Matrix = []

	let gIndex = pinyinLength
	let restMatched = targetLength - 1
	while (restMatched >= 0) {
		const [start, end, matchedLetters] = dpMatchPath[gIndex][restMatched]
		hitIndices.unshift([start + startIndex, end + startIndex])
		// 优先全字母匹配，从后开始往前遍历
		// 比如 zeheozh，输入 zho，虽然最后连续的 zh 权重比较大，但没有匹配到 o，从前面的 dpMatchPath 获取
		gIndex = originalIndices[start + startIndex] - originalIndices[startIndex] - 1
		restMatched -= matchedLetters
	}

	return hitIndices
}

/**
 * A function for search sentence by boundary mapping which's often is used to optimize the speed of searching.
 * It can reuse 'boundaryMapping' every time.
 * @param boundaryMapping the source boundary mapping data
 * @param sentence the target sentence
 */
export function searchSentenceByBoundaryMapping(boundaryMapping: SourceMappingData, sentence: string) {
	if (!sentence) return undefined
	const hitRangesByIndexOf = searchWithIndexOf(boundaryMapping.originalString, sentence)
	if (hitRangesByIndexOf) return hitRangesByIndexOf

	// if target include space characters, we should split it first and then iterate it one by one.
	const words = sentence.trim().split(/\s+/)
	const hitRanges: Matrix = []
	// iterate through each word
	for (const word of words) {
		// get the rest ranges of the source
		const restRanges = getRestRanges(boundaryMapping.originalLength, hitRanges)
		if (!restRanges.length) return undefined
		let isHitByWord = false
		for (const range of restRanges) {
			// continue to iterate the rest ranges of the source, search for matches
			const hitRangesByWord = searchByBoundaryMapping(boundaryMapping, word, range[0], range[1])
			if (hitRangesByWord) {
				isHitByWord = true
				hitRanges.push(...hitRangesByWord)
				break
			}
		}
		if (!isHitByWord) return undefined
	}

	return hitRanges.sort((a, b) => a[0] - b[0])
}

export function searchWithIndexOf(source: string, target: string) {
	const startIndex = source.indexOf(target)
	return ~startIndex && ([[startIndex, startIndex + target.length - 1]] as Matrix)
}

export function searchEntry(source: string, target: string, getBoundaryMapping: (source: string) => SourceMappingData) {
	return searchWithIndexOf(source, target) || searchSentenceByBoundaryMapping(getBoundaryMapping(source), target)
}

debugFn(() => {
	const originalString = '你 Chinese'
	const input = 'Chis n'
	console.log('original string:', originalString, 'input:', input)
	const boundaryData = extractBoundaryMappingWithPresetPinyin(originalString)
	console.log('boundaryData', boundaryData)
	const hitIndices = searchSentenceByBoundaryMapping(boundaryData, input)
	if (hitIndices) {
		console.log('hitIndices', hitIndices)
		console.log('isConsecutiveForChar', isConsecutiveForChar(originalString, input, hitIndices))
		console.log('merged spaces', mergeSpacesWithRanges(originalString, hitIndices))
		console.log(highlightTextWithRanges(originalString, mergeSpacesWithRanges(originalString, hitIndices)))
	}
})
