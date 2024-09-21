export type Matrix = [number, number][]

export interface SourceMappingData {
	pinyinString: string
	boundary: Matrix
	originalString: string
	originalIndices: number[]
	originalLength: number
}

export enum StrictnessLevel {
	strict = 'strict',
	lenient = 'lenient',
}

export type StrictnessLevelTypes = keyof typeof StrictnessLevel

export interface SearchOption {
	strictCase?: boolean
	mergeSpaces?: boolean
	strictness?: StrictnessLevelTypes
}

export interface SearchOptionWithPinyin extends SearchOption {
	// pass in pinyin map by user
	pinyinMap: Record<string, string[]>
}
