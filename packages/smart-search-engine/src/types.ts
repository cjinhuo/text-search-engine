export type BoundaryArray = [number, number][]

export interface BoundaryData {
	pinyinString: string
	boundary: BoundaryArray
	originalIndices: number[]
	originalLength: number
}
