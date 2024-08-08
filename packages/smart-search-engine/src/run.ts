import { getBoundary } from './boundary'
import { search } from './search'
import { highlightTextWithRanges } from './utils'
const originalString = 'nonode'
const input = 'nod'
const hitIndices = search(getBoundary(originalString), input)
console.log('hitIndices', hitIndices)
console.log('original string:', originalString, 'input:', input)
if (hitIndices) {
	console.log(highlightTextWithRanges(originalString, hitIndices))
}
