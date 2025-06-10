import { isAllChinese } from '../utils'

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
