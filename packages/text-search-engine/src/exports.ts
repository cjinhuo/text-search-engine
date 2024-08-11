import { extractBoundaryMapping, extractBoundaryMappingWithPresetPinyin } from './boundary'
import { searchEntry } from './search'
import type { SearchOption, SearchOptionWithPinyin } from './types'
import { highlightTextWithRanges, isEmptyString } from './utils'

/**
 * search string with
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @returns
 */
export function search(source: string, target: string, option: SearchOption = {}) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	const [_source, _target] = option.strictCase
		? [source, target]
		: [source.toLocaleLowerCase(), target.toLocaleLowerCase()]

	return searchEntry(_source, _target, extractBoundaryMappingWithPresetPinyin)
}

/**
 * search string without preset pinyin map, need to pass pinyin map in manually
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option required, need to pass pinyin map in manually
 * @returns
 */
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
