import pinyinMap from './py.json'
import type { BoundaryArray, BoundaryData } from './types'
export function getBoundary(str: string): BoundaryData {
	const lowerStr = str.toLocaleLowerCase()
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
		// index 是原有字符的下标
		totalChars.push(value[0])
		boundary.push([index, accumulator])
		originalIndices.push(accumulator)
		accumulator++
		if (value.length > 1) {
			// 说明是一个汉字，剩下的是拼音
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

	// originalIndices[pinyinArray.length] = pinyinString.length
	return {
		pinyinString,
		boundary,
		originalIndices,
		originalLength: pinyinArray.length,
	}
}
