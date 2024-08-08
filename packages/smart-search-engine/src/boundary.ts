import pinyinMap from './py.json'
import type { BoundaryArray, SourceMappingData } from './types'

/**
 * extract the mapping relationship between letters, pinyin, and Chinese characters by the source string
 * @param source the string you want to search
 * @returns the processed data
 */
export function extractBoundaryMapping(source: string): SourceMappingData {
	const lowerStr = source.toLocaleLowerCase()
	const pinyinArray = Array(lowerStr.length)

	for (let i = 0; i < lowerStr.length; i++) {
		const currentChar = lowerStr[i]
		const charInPinyin = pinyinMap[currentChar]
		pinyinArray[i] = [currentChar, ...(charInPinyin ? charInPinyin.slice() : [])]
	}

	let accumulator = 0
	const boundary: BoundaryArray = [[-1, -1]]
	const originalIndices: number[] = []
	const totalChars: string[] = []
	pinyinArray.forEach((value, index) => {
		totalChars.push(value[0])
		boundary.push([index, accumulator])
		originalIndices.push(accumulator)
		accumulator++
		if (value.length > 1) {
			// means it's a Chinese character then push all pinyin into boundary array
			for (let i = 1; i < value.length; i++) {
				const pinyinItem = value[i]
				totalChars.push(pinyinItem)
				const length = pinyinItem.length
				boundary.push(...Array(length).fill([index, accumulator]))
				accumulator += length
			}
		}
	})
	const pinyinString = totalChars.join('')

	return {
		pinyinString,
		boundary,
		originalIndices,
		originalLength: pinyinArray.length,
	}
}
