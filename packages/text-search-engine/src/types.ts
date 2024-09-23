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
}

export interface SearchOptionWithPinyin extends SearchOption {
	// pass in pinyin map by user
	pinyinMap: Record<string, string[]>
}
