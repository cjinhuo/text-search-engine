export { extractBoundaryMappingWithPresetPinyin as extractBoundaryMapping } from './boundary'
export {
	highlightMatches,
	search,
} from './exports'
export { searchSentenceByBoundaryMapping } from './search'
export { createSearcher, searchItems } from './search-items'
export * from './types'
export { isConsecutiveForChar, isStrictnessSatisfied, mergeSpacesWithRanges } from './utils'
