import type { Matrix } from '../types'
import { getRestRanges, isAllChinese, isStrictnessSatisfied, mergeSpacesWithRanges } from '../utils'

describe('isAllChinese', () => {
	// 基本场景测试
	test('should return true for pure Chinese characters', () => {
		expect(isAllChinese('中文')).toBe(true)
		expect(isAllChinese('你好世界')).toBe(true)
		expect(isAllChinese('测试用例')).toBe(true)
	})

	test('should return false for empty string', () => {
		expect(isAllChinese('')).toBe(false)
	})

	// 特殊字符测试
	test('should return false for strings with special characters', () => {
		expect(isAllChinese('中文!')).toBe(false)
		expect(isAllChinese('测试@')).toBe(false)
		expect(isAllChinese('#你好')).toBe(false)
		expect(isAllChinese('世界$')).toBe(false)
		expect(isAllChinese('测试%测试')).toBe(false)
		expect(isAllChinese('&测试')).toBe(false)
	})

	// 空格测试
	test('should return false for strings with spaces', () => {
		expect(isAllChinese('中文 汉字')).toBe(false)
		expect(isAllChinese(' 测试')).toBe(false)
		expect(isAllChinese('测试 ')).toBe(false)
	})

	// 数字测试
	test('should return false for strings with numbers', () => {
		expect(isAllChinese('测试123')).toBe(false)
		expect(isAllChinese('1测试')).toBe(false)
		expect(isAllChinese('测试2测试')).toBe(false)
	})

	// 英文字符测试
	test('should return false for strings with English characters', () => {
		expect(isAllChinese('测试test')).toBe(false)
		expect(isAllChinese('Test测试')).toBe(false)
		expect(isAllChinese('测试Test测试')).toBe(false)
	})

	// 混合字符测试
	test('should return false for strings with mixed characters', () => {
		expect(isAllChinese('测试123!')).toBe(false)
		expect(isAllChinese('Test测试@123')).toBe(false)
		expect(isAllChinese('你好world!')).toBe(false)
	})

	// 边界长度测试
	test('should handle strings of different lengths correctly', () => {
		// 测试长度为6及以下的字符串（使用charCodeAt判断的情况）
		expect(isAllChinese('一二三四五六')).toBe(true)
		expect(isAllChinese('一二三四五')).toBe(true)
		expect(isAllChinese('一')).toBe(true)

		// 测试长度大于6的字符串（使用正则判断的情况）
		expect(isAllChinese('一二三四五六七')).toBe(true)
		expect(isAllChinese('一二三四五六七八九十')).toBe(true)
	})

	// 标点符号测试
	test('should return false for strings with Chinese punctuation', () => {
		expect(isAllChinese('测试。')).toBe(false)
		expect(isAllChinese('测试，测试')).toBe(false)
		expect(isAllChinese('「测试」')).toBe(false)
		expect(isAllChinese('《测试》')).toBe(false)
	})

	// Unicode边界测试
	test('should handle Unicode edge cases correctly', () => {
		// U+4E00 是中文字符的开始
		expect(isAllChinese(String.fromCharCode(0x4e00))).toBe(true)
		// U+9FFF 是中文字符的结束
		expect(isAllChinese(String.fromCharCode(0x9fff))).toBe(true)
		// U+4DFF 是中文字符范围之前的字符
		expect(isAllChinese(String.fromCharCode(0x4dff))).toBe(false)
		// U+A000 是中文字符范围之后的字符
		expect(isAllChinese(String.fromCharCode(0xa000))).toBe(false)
	})
})

describe('isStrictnessSatisfied', () => {
	// 基本场景测试
	test('should return true when hit ranges length is within strictness limit', () => {
		const target = 'hello world'
		const rawHitRanges: Matrix = [
			[0, 4],
			[6, 10],
		] // 2 ranges

		// 严格系数为 0.5，目标长度为 11，最大命中长度为 Math.ceil(0.5 * 11) = 6
		// 2 <= 6，应该返回 true
		expect(isStrictnessSatisfied(0.5, target, rawHitRanges)).toBe(true)
	})

	test('should return false when hit ranges length exceeds strictness limit', () => {
		const target = 'hello'
		const rawHitRanges: Matrix = [
			[0, 0],
			[1, 1],
			[2, 2],
			[3, 3],
			[4, 4],
		] // 5 ranges

		// 严格系数为 0.2，目标长度为 5，最大命中长度为 Math.ceil(0.2 * 5) = 1
		// 5 > 1，应该返回 false
		expect(isStrictnessSatisfied(0.2, target, rawHitRanges)).toBe(false)
	})

	// 边界值测试
	test('should clamp strictness coefficient to minimum 0.1', () => {
		const target = 'test'
		const rawHitRanges: Matrix = [[0, 3]] // 1 range

		// 严格系数为 0，应该被限制为 0.1
		// 最大命中长度为 Math.ceil(0.1 * 4) = 1
		// 1 >= 1，应该返回 true
		expect(isStrictnessSatisfied(0, target, rawHitRanges)).toBe(true)
	})

	test('should clamp strictness coefficient to maximum 1', () => {
		const target = 'test'
		const rawHitRanges: Matrix = [
			[0, 0],
			[1, 1],
			[2, 2],
			[3, 3],
		] // 4 ranges

		// 严格系数为 2，应该被限制为 1
		// 最大命中长度为 Math.ceil(1 * 4) = 4
		// 4 >= 4，应该返回 true
		expect(isStrictnessSatisfied(2, target, rawHitRanges)).toBe(true)
	})

	// 空数组测试
	test('should return true for empty hit ranges', () => {
		const target = 'hello'
		const rawHitRanges: Matrix = []

		expect(isStrictnessSatisfied(0.5, target, rawHitRanges)).toBe(true)
	})

	// 精确边界测试
	test('should handle exact boundary cases', () => {
		const target = 'hello world' // 长度为 11
		const rawHitRanges: Matrix = [
			[0, 0],
			[1, 1],
			[2, 2],
			[3, 3],
			[4, 4],
			[5, 5],
		] // 6 ranges

		// 严格系数为 0.5，最大命中长度为 Math.ceil(0.5 * 11) = 6
		// 6 >= 6，应该返回 true
		expect(isStrictnessSatisfied(0.5, target, rawHitRanges)).toBe(true)

		// 添加一个范围，变成 7 ranges
		const rawHitRanges2: Matrix = [...rawHitRanges, [6, 6]]
		// 7 > 6，应该返回 false
		expect(isStrictnessSatisfied(0.5, target, rawHitRanges2)).toBe(false)
	})
})

describe('mergeSpacesWithRanges', () => {
	// 基本场景测试
	test('should return original ranges when only one range', () => {
		const source = 'hello world'
		const rawHitRanges: Matrix = [[0, 4]]

		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([[0, 4]])
	})

	test('should merge ranges separated by spaces', () => {
		const source = 'hello world test'
		const rawHitRanges: Matrix = [
			[0, 4],
			[6, 10],
			[12, 15],
		]

		// 'hello' 和 'world' 之间有空格，应该合并
		// 'world' 和 'test' 之间有空格，应该合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([[0, 15]])
	})

	test('should not merge ranges separated by non-space characters', () => {
		const source = 'hello-world-test'
		const rawHitRanges: Matrix = [
			[0, 4],
			[6, 10],
			[12, 15],
		]

		// 'hello' 和 'world' 之间有 '-'，不应该合并
		// 'world' 和 'test' 之间有 '-'，不应该合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([
			[0, 4],
			[6, 10],
			[12, 15],
		])
	})

	test('should merge some ranges and keep others separate', () => {
		const source = 'hello world-test case'
		const rawHitRanges: Matrix = [
			[0, 4],
			[6, 10],
			[12, 15],
			[17, 20],
		]

		// 'hello' 和 'world' 之间有空格，应该合并
		// 'world' 和 'test' 之间有 '-'，不应该合并
		// 'test' 和 'case' 之间有空格，应该合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([
			[0, 10],
			[12, 20],
		])
	})

	// 多个空格测试
	test('should merge ranges separated by multiple spaces', () => {
		const source = 'hello   world'
		const rawHitRanges: Matrix = [
			[0, 4],
			[8, 12],
		]

		// 'hello' 和 'world' 之间有多个空格，应该合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([[0, 12]])
	})

	// 制表符和换行符测试
	test('should merge ranges separated by whitespace characters', () => {
		const source = 'hello\t\nworld'
		const rawHitRanges: Matrix = [
			[0, 4],
			[7, 11],
		]

		// 'hello' 和 'world' 之间有制表符和换行符，应该合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([[0, 11]])
	})

	// 边界情况测试
	test('should handle adjacent ranges', () => {
		const source = 'helloworld'
		const rawHitRanges: Matrix = [
			[0, 4],
			[5, 9],
		]

		// 'hello' 和 'world' 之间没有字符，应该合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([[0, 9]])
	})

	test('should handle empty gap between ranges', () => {
		const source = 'hello world'
		const rawHitRanges: Matrix = [
			[0, 4],
			[5, 5],
			[6, 10],
		]

		// 所有范围之间都是空格或相邻，应该全部合并
		expect(mergeSpacesWithRanges(source, rawHitRanges)).toEqual([[0, 10]])
	})
})

describe('getRestRanges', () => {
	// 基本场景测试
	test('should return full range when no ranges provided', () => {
		expect(getRestRanges(10, [])).toEqual([[0, 10]])
	})

	test('should return rest ranges for single range', () => {
		const totalLength = 10
		const ranges: Matrix = [[2, 5]]

		// 应该返回 [0, 2) 和 [6, 10)
		expect(getRestRanges(totalLength, ranges)).toEqual([
			[0, 2],
			[6, 10],
		])
	})

	test('should return rest ranges for multiple ranges', () => {
		const totalLength = 15
		const ranges: Matrix = [
			[2, 4],
			[7, 9],
			[12, 13],
		]

		// 应该返回 [0, 2), [5, 7), [10, 12), [14, 15)
		expect(getRestRanges(totalLength, ranges)).toEqual([
			[0, 2],
			[5, 7],
			[10, 12],
			[14, 15],
		])
	})

	// 边界情况测试
	test('should handle range starting at 0', () => {
		const totalLength = 10
		const ranges: Matrix = [[0, 3]]

		// 应该返回 [4, 10)
		expect(getRestRanges(totalLength, ranges)).toEqual([[4, 10]])
	})

	test('should handle range ending at total length', () => {
		const totalLength = 10
		const ranges: Matrix = [[5, 9]]

		// 应该返回 [0, 5)，注意 ranges 使用闭区间，所以 end+1 = 10 等于 totalLength
		expect(getRestRanges(totalLength, ranges)).toEqual([[0, 5]])
	})

	test('should handle range covering entire length', () => {
		const totalLength = 10
		const ranges: Matrix = [[0, 9]]

		// 整个范围都被覆盖，应该返回空数组
		expect(getRestRanges(totalLength, ranges)).toEqual([])
	})

	// 相邻范围测试
	test('should handle adjacent ranges', () => {
		const totalLength = 10
		const ranges: Matrix = [
			[1, 3],
			[4, 6],
		]

		// 应该返回 [0, 1), [7, 10)
		expect(getRestRanges(totalLength, ranges)).toEqual([
			[0, 1],
			[7, 10],
		])
	})

	test('should handle overlapping ranges', () => {
		const totalLength = 10
		const ranges: Matrix = [
			[1, 5],
			[3, 7],
		]

		// 重叠范围，应该返回 [0, 1), [8, 10)
		expect(getRestRanges(totalLength, ranges)).toEqual([
			[0, 1],
			[8, 10],
		])
	})

	// 排序测试
	test('should handle unsorted ranges', () => {
		const totalLength = 10
		const ranges: Matrix = [
			[7, 8],
			[2, 4],
			[0, 1],
		]

		// 函数内部会排序，应该返回 [5, 7), [9, 10)
		expect(getRestRanges(totalLength, ranges)).toEqual([
			[5, 7],
			[9, 10],
		])
	})

	// 单点范围测试
	test('should handle single point ranges', () => {
		const totalLength = 5
		const ranges: Matrix = [
			[1, 1],
			[3, 3],
		]

		// 应该返回 [0, 1), [2, 3), [4, 5)
		expect(getRestRanges(totalLength, ranges)).toEqual([
			[0, 1],
			[2, 3],
			[4, 5],
		])
	})

	// 空总长度测试
	test('should handle zero total length', () => {
		expect(getRestRanges(0, [])).toEqual([[0, 0]])
	})

	test('should handle zero total length with ranges', () => {
		const totalLength = 0
		const ranges: Matrix = [[0, 0]]

		// 总长度为0且有范围覆盖，应该返回空数组
		expect(getRestRanges(totalLength, ranges)).toEqual([])
	})
})
