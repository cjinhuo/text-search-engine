import { extractBoundaryMapping } from '../boundary'
import { search } from '../exports'
import { searchByBoundaryMapping } from '../search'

describe('search', () => {
	test('searchByBoundaryMapping should work', () => {
		const source = 'node'
		const target = 'no'
		const mappingData = extractBoundaryMapping(source)
		const range = searchByBoundaryMapping(mappingData, target, 0, source.length)
		expect(range).toEqual([[0, 1]])
	})

	test('search should work with pure latin', () => {
		const source = 'nonode'
		expect(search(source, 'no')).toEqual([[0, 1]])
		// 匹配到 nod，连续三个的的权重值更高
		expect(search(source, 'nod')).toEqual([[2, 4]])
		expect(search(source, 'oo')).toEqual([
			[1, 1],
			[3, 3],
		])
	})

	test('search should work with pure Chinese characters', () => {
		const source = '地表最强前端监控平台'
		expect(search(source, 'jk')).toEqual([[6, 7]])
		expect(search(source, 'qianduapt')).toEqual([
			[4, 5],
			[8, 9],
		])
	})

	test('search should work with Chinese characters and latin', () => {
		const source_1 = 'Node.js 最强监控平台 V8'
		expect(search(source_1, 'nodejk')).toEqual([
			[0, 3],
			[10, 11],
		])
		expect(search(source_1, 'jkv8')).toEqual([
			[10, 11],
			[15, 16],
		])

		const source_2 = 'a_nd你你的就是我的'
		expect(search(source_2, 'nd')).toEqual([[2, 3]])
		// 匹配到 你你的
		expect(search(source_2, 'nnd')).toEqual([[4, 6]])
		// 匹配到 a_'n'd你你的就'是我的'
		expect(search(source_2, 'nshwode')).toEqual([
			[2, 2],
			[8, 10],
		])
	})

	test('search should work with space characters for break word', () => {
		const source_1 = 'Node.js 最强监控平台 V8'
		expect(search(source_1, 'jknode')).toEqual(undefined)
		// 加空格后，每个词都是独立的，都会从头开始匹配，已匹配到的词会被移除，下次从头匹配时会忽略已匹配到的词
		expect(search(source_1, 'jk node')).toEqual([
			[0, 3],
			[10, 11],
		])
	})

	test('search should work like Backtracking', () => {
		const source_1 = 'zxhxo zhx'
		expect(search(source_1, 'zh')).toEqual([[6, 7]])
		// 虽然 zh 权重值比较高，但后面没有匹配到 o
		expect(search(source_1, 'zho')).toEqual([
			[0, 0],
			[2, 2],
			[4, 4],
		])
	})

	test('mergeSpaces should work within search', () => {
		const source_1 = 'chrome 应用商店'
		expect(search(source_1, 'meyinyon', { mergeSpaces: false })).toEqual([
			[4, 5],
			[7, 8],
		])
		expect(search(source_1, 'meyinyon', { mergeSpaces: true })).toEqual([[4, 8]])
	})

	test('strictnessCoefficient should work within search', () => {
		const source_1 = 'Node.js 最强监控平台 V8'
		expect(search(source_1, 'nozjk')).toEqual([
			[0, 1],
			[8, 8],
			[10, 11],
		])

		// 当 strictnessCoefficient 为 0.5 时，nozjk 为 五个字符， Math.ceil(5 * 0.5) = 3， 命中小于等于 3 个字符时正常返回
		expect(search(source_1, 'nozjk', { strictnessCoefficient: 0.5 })).toEqual([
			[0, 1],
			[8, 8],
			[10, 11],
		])

		expect(search(source_1, 'nozjk', { strictnessCoefficient: 0.4 })).toEqual(undefined)
	})
})
