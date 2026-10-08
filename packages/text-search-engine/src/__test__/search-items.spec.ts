import * as boundary from '../boundary'
import { search } from '../exports'
import { createSearcher, searchItems } from '../search-items'
import type { SearchOption } from '../types'

jest.mock('../boundary', () => {
	const actual = jest.requireActual('../boundary')
	return { ...actual, extractBoundaryMappingWithPresetPinyin: jest.fn(actual.extractBoundaryMappingWithPresetPinyin) }
})

afterEach(() => jest.clearAllMocks())

test('strings preserve indices, duplicates and original casing without a field map', () => {
	const input = Object.freeze(['React', 'other', 'React'])
	expect(searchItems(input, 'react')).toEqual([
		{ item: 'React', index: 0, text: 'React', hitRanges: [[0, 4]] },
		{ item: 'React', index: 2, text: 'React', hitRanges: [[0, 4]] },
	])
})

test('sparse string arrays skip holes while preserving original indices and duplicates', () => {
	const input = ['removed', 'React', 'removed', 'React', 'removed']
	delete input[0]
	delete input[2]
	delete input[4]
	Object.freeze(input)
	const expected = [
		{ item: 'React', index: 1, text: 'React', hitRanges: [[0, 4]] },
		{ item: 'React', index: 3, text: 'React', hitRanges: [[0, 4]] },
	]
	expect(searchItems(input, 'react')).toEqual(expected)
	const searcher = createSearcher(input, { sort: () => 0 })
	expect(searcher.search('react')).toEqual(expected)
	expect(searcher.search('React')).toEqual(expected)
	expect(searcher.search('no match')).toEqual([])
})

test('sparse object arrays pass original indices to getters and preserve item references', () => {
	const items = new Array<{ title: string; host: string }>(5)
	items[1] = { title: 'React', host: 'github.com' }
	items[3] = { title: 'Vue', host: 'vuejs.org' }
	Object.freeze(items)
	const getFields = jest.fn((item: (typeof items)[number]) => ({ title: item.title, host: item.host }))
	const searcher = createSearcher(items, { getFields })
	expect(searcher.search('github')[0]).toEqual({
		item: items[1],
		index: 1,
		text: 'Reactgithub.com',
		hitRanges: [[5, 10]],
		fieldHitRanges: { title: [], host: [[0, 5]] },
	})
	expect(searcher.search('vue')[0].item).toBe(items[3])
	expect(getFields.mock.calls).toEqual([
		[items[1], 1],
		[items[3], 3],
	])
	const getText = jest.fn((item: (typeof items)[number], index: number) => item.title + index)
	expect(searchItems(items, 'Vue3', { getText })[0].index).toBe(3)
	expect(getText.mock.calls.map((args) => args[1])).toEqual([1, 3])
})

test('sparse arrays containing only holes return no results', () => {
	const input = Object.freeze(new Array<string>(3))
	expect(searchItems(input, 'react')).toEqual([])
	expect(createSearcher(input).search('react')).toEqual([])
})

test('object getters run once with input indices, preserving item references', () => {
	const items = [{ title: '监控' }, { title: 'React' }]
	const getText = jest.fn((item: (typeof items)[number], index: number) => item.title + index)
	const searcher = createSearcher(items, { getText })
	expect(getText.mock.calls.map((args) => args[1])).toEqual([0, 1])
	expect(searcher.search('jk')[0].item).toBe(items[0])
	searcher.search('r')
	expect(getText).toHaveBeenCalledTimes(2)
})

test('case-fold expansion keeps original UTF-16 and field coordinates', () => {
	const item = { title: 'İ', host: 'github.com' }
	const result = searchItems([item], 'github', { getFields: (i) => i })[0]
	expect(result.hitRanges).toEqual([[1, 6]])
	expect(result.fieldHitRanges).toEqual({ title: [], host: [[0, 5]] })
	expect(searchItems(['İgithub'], 'github')[0].hitRanges).toEqual([[1, 6]])
	expect(searchItems(['İ'], 'i')[0].hitRanges).toEqual([[0, 0]])
})

test.each(['react', 'github', 'react github', 'github react', 'ctgi'])('splits multi-field ranges for %s', (query) => {
	const item = { title: 'react', host: 'github.com', empty: '' }
	const result = searchItems([item], query, { getFields: (i) => i })[0]
	expect(result.hitRanges).toEqual(search('reactgithub.com', query))
	expect(result.fieldHitRanges.empty).toEqual([])
	for (const field of ['title', 'host'] as const) {
		for (const [start, end] of result.fieldHitRanges[field]) {
			expect(start).toBeGreaterThanOrEqual(0)
			expect(end).toBeLessThan(item[field].length)
		}
	}
	if (query === 'react github') {
		expect(result.fieldHitRanges).toEqual({ title: [[0, 4]], host: [[0, 5]], empty: [] })
	}
	if (query === 'ctgi') {
		expect(result.fieldHitRanges.title).toEqual([[3, 4]])
		expect(result.fieldHitRanges.host).toEqual([[0, 1]])
	}
})

test('uses enumerable property order, including empty fields and special keys', () => {
	const fields = JSON.parse('{"2":"b","1":"a","__proto__":"c","empty":""}') as Record<string, string>
	const result = searchItems([fields], 'abc', { getFields: (i) => i })[0]
	expect(result.text).toBe('abc')
	expect(result.fieldHitRanges.__proto__).toEqual([[0, 0]])
	expect(result.fieldHitRanges.empty).toEqual([])
})

test.each(['', ' \t\n', 'no match'])('handles empty and missing matches for %j', (query) => {
	expect(searchItems(['监控'], query)).toEqual([])
	expect(searchItems([], query)).toEqual([])
	expect(searchItems(['', '  '], query)).toEqual([])
})

test('custom sorting keeps ties in input order', () => {
	const items = ['a long', 'a', 'a long']
	expect(searchItems(items, 'a', { sort: (a, b) => a.text.length - b.text.length }).map((r) => r.index)).toEqual([
		1, 0, 2,
	])
})

test('matches the existing search pipeline across all option combinations', () => {
	const sources = ['监 控 平example.com', 'Node.js 最强监控平台 V9', 'Hello World', 'reactgithub.com']
	const queries = ['jkp', 'nodejk', 'hello', 'react github', 'jk node', 'V9']
	for (const strictCase of [false, true])
		for (const mergeSpaces of [false, true]) {
			for (const isCharConsecutive of [false, true])
				for (const strictnessCoefficient of [undefined, 0.6]) {
					const options: SearchOption = { strictCase, mergeSpaces, isCharConsecutive, strictnessCoefficient }
					const searcher = createSearcher(sources, options)
					for (const query of queries) {
						const expected = sources.flatMap((source, index) => {
							const hitRanges = search(source, query, options)
							return hitRanges ? [{ item: source, text: source, index, hitRanges }] : []
						})
						expect(searcher.search(query)).toEqual(expected)
					}
				}
		}
})

test('builds lazy mappings once per item and reuses them across queries', () => {
	const spy = jest.mocked(boundary.extractBoundaryMappingWithPresetPinyin)
	const searcher = createSearcher(['监控平台', 'react'])
	searcher.search('react')
	// 仅中文条目需要回退到模糊匹配；React 直接命中时无需构建映射。
	expect(spy).toHaveBeenCalledTimes(1)
	searcher.search('jk')
	searcher.search('jkp')
	expect(spy).toHaveBeenCalledTimes(2)
	createSearcher(['监控平台']).search('jk')
	expect(spy).toHaveBeenCalledTimes(3)
})

test('snapshots list, fields and options; each query owns its ranges', () => {
	const item = { title: 'React', host: 'github.com' }
	const items = [item]
	const fields = { title: item.title, host: item.host }
	const options = { getFields: () => fields, strictCase: false }
	const searcher = createSearcher(items, options)
	const result = searcher.search('react')[0]
	result.hitRanges[0][0] = 99
	result.fieldHitRanges.title[0][0] = 88
	fields.title = item.title = 'Other'
	items.length = 0
	options.strictCase = true
	const next = searcher.search('react')[0]
	expect(next.text).toBe('Reactgithub.com')
	expect(next.hitRanges).toEqual([[0, 4]])
	expect(next.fieldHitRanges.title).toEqual([[0, 4]])
	expect(next.item).toBe(item)
	expect(createSearcher([item], { getFields: (i) => i }).search('react')).toEqual([])
})

test('one-off calls do not share mappings', () => {
	const spy = jest.mocked(boundary.extractBoundaryMappingWithPresetPinyin)
	searchItems(['监控'], 'jk')
	searchItems(['监控'], 'jk')
	expect(spy).toHaveBeenCalledTimes(2)
})
