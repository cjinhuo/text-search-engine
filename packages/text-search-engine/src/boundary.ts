import pinyin from './py.json'
import type { Matrix, SourceMappingData } from './types'

/**
 * extract the mapping relationship between letters, pinyin, and Chinese characters by the source string
 * @param source the string you want to process
 * @param pinyinMap the pinyin map you want to use
 * @example
 * pinyinMap: {
 * 	你: ['ni'],
 *  的: ['de', 'di'],
 * }
 * source: 你的
 * pinyinString: 你ni的dedi
 * boundary: [ [ -1, -1 ], [ 0, 0 ], [ 0, 1 ], [ 0, 1 ], [ 1, 3 ], [ 1, 4 ], [ 1, 4 ], [ 1, 6 ], [ 1, 6 ] ]
 * source: test
 * boundary: [ [ -1, -1 ], [ 0, 0 ], [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]
 * source: 你test
 * pinyinString: 你nitest
 * boundary: [ [ -1, -1 ], [ 0, 0 ], [ 0, 1 ], [ 0, 1 ], [ 1, 3 ], [ 2, 4 ], [ 3, 5 ], [ 4, 6 ] ]
 * @returns the processed data
 */
export function extractBoundaryMapping(source: string, pinyinMap: Record<string, string[]> = {}): SourceMappingData {
	const pinyinArray = Array(source.length)

	for (let i = 0; i < source.length; i++) {
		const currentChar = source[i]
		const charInPinyin = pinyinMap[currentChar]
		pinyinArray[i] = [currentChar, ...(charInPinyin ? charInPinyin.slice() : [])]
	}

	let accumulator = 0
	const boundary: Matrix = [[-1, -1]]
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
	// it's convenient to get the real index the search function
	originalIndices.push(pinyinString.length)
	return {
		pinyinString,
		boundary,
		originalString: source,
		originalIndices,
		originalLength: pinyinArray.length,
	}
}

export const extractBoundaryMappingWithPresetPinyin = (source: string): SourceMappingData =>
	extractBoundaryMapping(source, pinyin)
