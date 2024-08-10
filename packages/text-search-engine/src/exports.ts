import { extractBoundaryMapping, extractBoundaryMappingWithPresetPinyin } from './boundary'
import { searchWithWords } from './search'
import type { SearchOption, SearchOptionWithPinyin } from './types'
import { highlightTextWithRanges, isEmptyString } from './utils'

export { extractBoundaryMapping } from './boundary'
export { searchByBoundaryMapping } from './search'

/**
 * search string with
 * @param source the string you want to search
 * @param target the string by user input. generally speaking, it's length should be less than `source`
 * @returns
 */
export function search(source: string, target: string, _option: SearchOption = {}) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	// if target include space characters, we should split it first and then iterate it one by one.
	return searchWithWords(extractBoundaryMappingWithPresetPinyin(source), target.trim().split(/\s+/))
}

export function pureSearch(source: string, target: string, option: SearchOptionWithPinyin) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	// if target include space characters, we should split it first and then iterate it one by one.
	return searchWithWords(extractBoundaryMapping(source, option.pinyinMap), target.trim().split(/\s+/))
}

export function highlightMatches(source: string, target: string, _option: SearchOption = {}) {
	const range = search(source, target)
	return range ? highlightTextWithRanges(source, range) : source
}

export function pureHighlightMatches(source: string, target: string, option: SearchOptionWithPinyin) {
	const range = pureSearch(source, target, option)
	return range ? highlightTextWithRanges(source, range) : source
}
