// [当前字符下标, 拼音或英文下标]，如果都不在中文拼音集中，则两个下标相同
export type Matrix = [number, number][]

export interface SourceMappingData {
	pinyinString: string
	boundary: Matrix
	originalString: string
	originalIndices: number[]
	originalLength: number
}

export interface SearchOption {
	strictCase?: boolean
	mergeSpaces?: boolean
	// (0, 1]，值越小，匹配越严格
	strictnessCoefficient?: number
	isCharConsecutive?: boolean // 判断命中的字符串是否为连续单词
}

export interface SearchOptionWithPinyin extends SearchOption {
	// 用户自定义的拼音映射
	pinyinMap: Record<string, string[]>
}

export interface SearchItemBase<T> {
	item: T
	/** 输入快照中的下标，重复条目也各自保留位置。 */
	index: number
	/** 原始文本，多字段按属性顺序拼接。 */
	text: string
	hitRanges: Matrix
}

export type SearchItemResult<T, K extends string = never> = [K] extends [never]
	? SearchItemBase<T>
	: SearchItemBase<T> & { fieldHitRanges: Record<K, Matrix> }

export interface Searcher<T, K extends string = never> {
	search(query: string): SearchItemResult<T, K>[]
}

export interface SearchItemsOptions<T, K extends string = never> extends SearchOption {
	sort?: (a: SearchItemResult<T, K>, b: SearchItemResult<T, K>) => number
}

export interface SearchFieldsOptions<T, K extends string> extends SearchItemsOptions<T, K> {
	getFields: (item: T, index: number) => Record<K, string>
	getText?: never
}

export interface SearchTextOptions<T> extends SearchItemsOptions<T> {
	getText: (item: T, index: number) => string
	getFields?: never
}

export interface SearchStringOptions<T extends string> extends SearchItemsOptions<T> {
	getText?: never
	getFields?: never
}
