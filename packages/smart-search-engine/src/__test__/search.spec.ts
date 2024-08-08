import { extractBoundaryMapping } from '../boundary'
import { search } from '../index'
import { searchByBoundaryMapping } from '../search'

describe('search', () => {
	test('searchByBoundaryMapping should work', () => {
		const source = 'node'
		const target = 'no'
		const mappingData = extractBoundaryMapping(source)
		const range = searchByBoundaryMapping(mappingData, target)
		expect(range).toEqual([[0, 1]])
	})

	test('search should work', () => {
		const source = 'node'
		const target = 'no'
		const range = search(source, target)
		expect(range).toEqual([[0, 1]])
	})

	// test('searching for list', () => {
	// 	const data = [
	// 		{ value: 'one', id: 1 },
	// 		{ value: 'two', id: 2 },
	// 	]

	// 	const processedData = data
	// 		.map((item) => ({ ...item, sourceMappingData: extractBoundaryMapping(item.value) }))
	// 		.reduce((acc, cur) => {
	// 			searchByBoundaryMapping(cur.sourceMappingData, 'one')
	// 			return acc
	// 		}, [])
	// })
})
