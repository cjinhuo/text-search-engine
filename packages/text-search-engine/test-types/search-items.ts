import { createSearcher, type Searcher, type SearchItemResult, searchItems } from '../src'

const items = [{ id: 1, title: 'React 监控', host: 'github.com' }] as const
const searcher = createSearcher(items, {
	getFields: (item, index) => ({ title: item.title, host: item.host + index }),
	sort: (a, b) => {
		a.item.id satisfies 1
		a.fieldHitRanges.host
		// @ts-expect-error 排序回调中的字段名应保持精确类型
		a.fieldHitRanges.typo
		return a.index - b.index
	},
})
searcher satisfies Searcher<(typeof items)[number], 'title' | 'host'>
searcher.search('jk')[0].fieldHitRanges.host
// @ts-expect-error 推导出的字段名不应被拓宽为 string
searcher.search('jk')[0].fieldHitRanges.typo
// @ts-expect-error 保留原条目的只读属性
searcher.search('jk')[0].item.title = 'Other'

searchItems(items, 'react', { getFields: (item) => ({ title: item.title }) }) satisfies SearchItemResult<
	(typeof items)[number],
	'title'
>[]
searchItems(items, 'react', {
	getFields: (item) => ({ title: item.title }),
	sort: (a, b) => {
		// @ts-expect-error 排序回调不能访问 getter 未返回的字段
		a.fieldHitRanges.host
		return a.fieldHitRanges.title.length - b.fieldHitRanges.title.length
	},
})
const single = createSearcher(items, { getText: (item) => item.title })
single satisfies Searcher<(typeof items)[number]>
// @ts-expect-error 单字段结果不包含 fieldHitRanges
single.search('react')[0].fieldHitRanges

const strings = createSearcher(['React', '监控'] as const, { sort: (a, b) => a.index - b.index })
strings.search('react')[0].item satisfies 'React' | '监控'
searchItems(['React'] as const, 'r')[0].item satisfies 'React'

type UnionItem = { kind: 'tab'; title: string; id: number } | { kind: 'history'; title: string; url: string }
declare const unionItems: readonly UnionItem[]
const unionResult = createSearcher(unionItems, { getText: (item) => item.title }).search('react')[0].item
if (unionResult.kind === 'tab') unionResult.id satisfies number

interface Fields {
	title: string
	host: string
}
declare const namedGetter: (item: (typeof items)[number]) => Fields
createSearcher(items, { getFields: namedGetter }) satisfies Searcher<(typeof items)[number], 'title' | 'host'>

// @ts-expect-error 搜索对象列表时必须提供 getter
createSearcher(items)
// @ts-expect-error 一次性搜索对象列表时也必须提供 getter
searchItems(items, 'react', {})
// @ts-expect-error getText 与 getFields 互斥
createSearcher(items, { getText: (item) => item.title, getFields: (item) => ({ title: item.title }) })
// @ts-expect-error 字段值必须是字符串
createSearcher(items, { getFields: (item) => ({ id: item.id }) })
// @ts-expect-error getText 必须返回字符串
searchItems(items, 'react', { getText: (item) => item.id })
