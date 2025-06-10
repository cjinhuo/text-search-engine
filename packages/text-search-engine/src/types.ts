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
	// (0, 1]
	strictnessCoefficient?: number
	isCharConsecutive?: boolean // 判断命中的字符串是否为连续单词
}

export interface SearchOptionWithPinyin extends SearchOption {
	// pass in pinyin map by user
	pinyinMap: Record<string, string[]>
}
