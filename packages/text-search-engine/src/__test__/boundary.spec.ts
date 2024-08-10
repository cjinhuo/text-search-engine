import { extractBoundaryMapping } from '../boundary'

describe('extractBoundaryMapping', () => {
	test('extractBoundaryMapping should work with whole letters', () => {
		const source = 'node'
		const mappingData = extractBoundaryMapping(source)
		expect(mappingData.pinyinString.length).toBe(source.length)
	})
})
