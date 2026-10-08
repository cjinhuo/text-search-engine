import { extractBoundaryMappingWithPresetPinyin } from './boundary'
import { DEFAULT_SEARCH_OPTION } from './constants'
import { searchPrepared } from './search-prepared'
import type {
	Matrix,
	Searcher,
	SearchFieldsOptions,
	SearchItemResult,
	SearchItemsOptions,
	SearchStringOptions,
	SearchTextOptions,
	SourceMappingData,
} from './types'
import { isEmptyString } from './utils'

type Options<T, K extends string> = SearchItemsOptions<T, K> & {
	getFields?: (item: T, index: number) => Record<K, string>
	getText?: (item: T, index: number) => string
}
interface FieldOffset {
	key: string
	start: number
	length: number
}

function requireText(value: unknown): string {
	if (typeof value !== 'string') throw new TypeError('Search text and field values must be strings')
	return value
}

/** 创建文本快照，按需构建并在实例内缓存拼音映射，供重复查询复用。 */
export function createSearcher<T, K extends string>(
	items: readonly T[],
	options: SearchFieldsOptions<T, K>
): Searcher<T, K>
export function createSearcher<T>(items: readonly T[], options: SearchTextOptions<T>): Searcher<T>
export function createSearcher<T extends string>(items: readonly T[], options?: SearchStringOptions<T>): Searcher<T>
export function createSearcher<T, K extends string>(items: readonly T[], options?: Options<T, K>): Searcher<T, K> {
	const option: Options<T, K> = { ...DEFAULT_SEARCH_OPTION, ...options }
	if (option.getText && option.getFields) throw new TypeError('Use either getText or getFields')
	const entries = items.map((item, index) => {
		const fields: FieldOffset[] = []
		let text: string
		if (option.getFields) {
			const values = option.getFields(item, index)
			text = ''
			// Object.keys 与 Object.entries 的可枚举字符串键顺序一致。
			for (const key of Object.keys(values)) {
				const value = requireText(values[key as K])
				fields.push({ key, start: text.length, length: value.length })
				text += value
			}
		} else {
			text = requireText(option.getText ? option.getText(item, index) : item)
		}
		const source = option.strictCase ? text : text.toLocaleLowerCase()
		// 部分字符转为小写后会增加 UTF-16 长度（例如 İ 变为 i 加组合点）。
		// 结果坐标始终对应原始快照及其字段。
		let originalIndices: number[] | undefined
		if (source.length !== text.length) {
			originalIndices = []
			for (let originalIndex = 0; originalIndex < text.length; originalIndex++) {
				const foldedLength = text[originalIndex].toLocaleLowerCase().length
				for (let offset = 0; offset < foldedLength; offset++) originalIndices.push(originalIndex)
			}
		}
		let mapping: SourceMappingData | undefined
		return {
			item,
			index,
			text,
			source,
			fields,
			originalIndices,
			getMapping: () => {
				if (!mapping) mapping = extractBoundaryMappingWithPresetPinyin(source)
				return mapping
			},
		}
	})
	return {
		search(query) {
			if (isEmptyString(query)) return []
			const target = option.strictCase ? query : query.toLocaleLowerCase()
			const results: SearchItemResult<T, K>[] = []
			for (const entry of entries) {
				// map 会保留数组空槽，遍历时需要跳过。
				if (!entry || isEmptyString(entry.source)) continue
				const hitRanges = searchPrepared(entry.source, target, option, entry.getMapping)
				if (!hitRanges) continue
				const ranges = hitRanges.map(([start, end]): [number, number] => [
					entry.originalIndices?.[start] ?? start,
					entry.originalIndices?.[end] ?? end,
				])
				const result = {
					item: entry.item,
					index: entry.index,
					text: entry.text,
					hitRanges: ranges,
				}
				if (option.getFields) {
					const fieldHitRanges: Record<string, Matrix> = {}
					for (const field of entry.fields) {
						const fieldRanges: Matrix = []
						for (const [start, end] of ranges) {
							const localStart = Math.max(start, field.start) - field.start
							const localEnd = Math.min(end, field.start + field.length - 1) - field.start
							if (localStart <= localEnd) fieldRanges.push([localStart, localEnd])
						}
						Object.defineProperty(fieldHitRanges, field.key, {
							value: fieldRanges,
							enumerable: true,
							writable: true,
							configurable: true,
						})
					}
					results.push({ ...result, fieldHitRanges } as SearchItemResult<T, K>)
				} else {
					results.push(result as SearchItemResult<T, K>)
				}
			}
			// 比较结果相同时按输入下标排序，确保 ES2015 运行环境也保留原始顺序。
			const sort = option.sort
			if (sort) results.sort((a, b) => sort(a, b) || a.index - b.index)
			return results
		},
	}
}

/** 一次性批量搜索；重复查询时应保留 createSearcher 实例以复用映射。 */
export function searchItems<T, K extends string>(
	items: readonly T[],
	query: string,
	options: SearchFieldsOptions<T, K>
): SearchItemResult<T, K>[]
export function searchItems<T>(items: readonly T[], query: string, options: SearchTextOptions<T>): SearchItemResult<T>[]
export function searchItems<T extends string>(
	items: readonly T[],
	query: string,
	options?: SearchStringOptions<T>
): SearchItemResult<T>[]
export function searchItems<T, K extends string>(
	items: readonly T[],
	query: string,
	options?: Options<T, K>
): SearchItemResult<T, K>[] {
	// 公共重载约束 getter 的选择；实现复用同一套匹配流程。
	return createSearcher(items, options as SearchFieldsOptions<T, K>).search(query)
}
