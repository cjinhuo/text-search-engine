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
			[10, 11],
			[0, 3],
		])
	})
})
