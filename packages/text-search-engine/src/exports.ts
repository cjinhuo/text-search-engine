import { extractBoundaryMapping, extractBoundaryMappingWithPresetPinyin } from './boundary'
import { searchEntry } from './search'
import type { SearchOption, SearchOptionWithPinyin } from './types'
import { highlightTextWithRanges, isEmptyString } from './utils'

/**
 * search string with
 * @param source the string you want to search
 * @param target the string by user input. generally speaking, it's length should be less than `source`
 * @returns
 */
export function search(source: string, target: string, option: SearchOption = {}) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	const [_source, _target] = option.strictCase
		? [source, target]
		: [source.toLocaleLowerCase(), target.toLocaleLowerCase()]

	return searchEntry(_source, _target, extractBoundaryMappingWithPresetPinyin)
}

export function pureSearch(source: string, target: string, option: SearchOptionWithPinyin) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	const [_source, _target] = option.strictCase
		? [source, target]
		: [source.toLocaleLowerCase(), target.toLocaleLowerCase()]

	return searchEntry(_source, _target, extractBoundaryMapping.bind(null, _source, option.pinyinMap))
}

export function highlightMatches(source: string, target: string, _option: SearchOption = {}) {
	const range = search(source, target)
	return range ? highlightTextWithRanges(source, range) : source
}

export function pureHighlightMatches(source: string, target: string, option: SearchOptionWithPinyin) {
	const range = pureSearch(source, target, option)
	return range ? highlightTextWithRanges(source, range) : source
}
