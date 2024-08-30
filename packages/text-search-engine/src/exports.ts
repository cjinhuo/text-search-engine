import { extractBoundaryMapping } from './boundary'
import pinyin from './py.json'
import { searchEntry } from './search'
import type { SearchOption, SearchOptionWithPinyin } from './types'
import { highlightTextWithRanges, isEmptyString, mergeSpacesWithRanges } from './utils'

/**
 * search string with
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @example search('mito 监控', 'mijk') // [[0, 1], [5, 6]]
 */
export function search(source: string, target: string, option: SearchOption = {}) {
	return pureSearch(source, target, { ...option, pinyinMap: pinyin })
}

/**
 * search string without preset pinyin map, need to pass pinyin map in manually
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option required, need to pass pinyin map in manually
 * @example pureSearch('mito 监控', 'mijk', { pinyinMap: { 监: ['jian'], 控: ['kong'] } }) // [[0, 1], [5, 6]]
 */
export function pureSearch(source: string, target: string, option: SearchOptionWithPinyin) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	const [_source, _target] = option.strictCase
		? [source, target]
		: [source.toLocaleLowerCase(), target.toLocaleLowerCase()]

	const rawHitRanges = searchEntry(_source, _target, extractBoundaryMapping.bind(null, _source, option.pinyinMap))
	return rawHitRanges && option.mergeSpaces ? mergeSpacesWithRanges(_source, rawHitRanges) : rawHitRanges
}

/**
 * return the highlighted string when there is a match
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @example console.log(highlightMatches('mito 监控', 'mijk'))
 */
export function highlightMatches(source: string, target: string, _option: SearchOption = {}) {
	return pureHighlightMatches(source, target, { ..._option, pinyinMap: pinyin })
}

/**
 * return the highlighted string when there is a match
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @example console.log(pureHighlightMatches('mito 监控', 'mijk', { pinyinMap: { 监: ['jian'], 控: ['kong'] } }))
 */
export function pureHighlightMatches(source: string, target: string, option: SearchOptionWithPinyin) {
	const range = pureSearch(source, target, option)
	return range ? highlightTextWithRanges(source, range) : source
}
