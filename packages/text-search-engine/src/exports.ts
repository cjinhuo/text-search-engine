import { extractBoundaryMapping, extractBoundaryMappingWithPresetPinyin } from './boundary'
import { searchByBoundaryMapping } from './search'
import type { SearchOption, SearchOptionWithPinyin } from './types'
import { highlightTextWithRanges } from './utils'

export { extractBoundaryMapping } from './boundary'
export { searchByBoundaryMapping } from './search'

/**
 * search string with
 * @param source the string you want to search
 * @param target the string by user input. generally speaking, it's length should be less than `source`
 * @returns
 */
export function search(source: string, target: string, _option: SearchOption = {}) {
	// if target include space characters, we should split it first and then iterate it one by one.
	if (!source.trim().length || !target.trim().length) return undefined
	const boundaryMapping = extractBoundaryMappingWithPresetPinyin(source)
	const restRange = [0, source.length]
	for (const word of target.split(' ')) {
		const range = searchByBoundaryMapping(boundaryMapping, word, restRange[0], restRange[1])
	}
	return searchByBoundaryMapping(extractBoundaryMappingWithPresetPinyin(source), target)
}

export function pureSearch(source: string, target: string, option: SearchOptionWithPinyin) {
	return searchByBoundaryMapping(extractBoundaryMapping(source, option.pinyinMap), target)
}

export function highlightMatches(source: string, target: string, _option: SearchOption = {}) {
	const range = search(source, target, _option)
	return range ? highlightTextWithRanges(source, range) : source
}

export function pureHighlightMatches(source: string, target: string, option: SearchOptionWithPinyin) {
	const range = pureSearch(source, target, option)
	return range ? highlightTextWithRanges(source, range) : source
}
