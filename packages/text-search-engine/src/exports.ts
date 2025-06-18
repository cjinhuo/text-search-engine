import { extractBoundaryMapping } from './boundary'
import { DEFAULT_SEARCH_OPTION } from './constants'
import pinyin from './py.json'
import { searchEntry } from './search'
import type { SearchOption, SearchOptionWithPinyin } from './types'
import {
	highlightTextWithRanges,
	isConsecutiveForChar,
	isEmptyString,
	isStrictnessSatisfied,
	mergeSpacesWithRanges,
} from './utils'

/**
 * Perform a fuzzy search under the preset Pinyin collection and return the indices of the matched original characters.
 * 在预设拼音集合下模糊搜索并返回命中原字符的下标
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @example search('mito 监控', 'mijk') // [[0, 1], [5, 6]]
 */
export function search(source: string, target: string, option: SearchOption = {}) {
	return pureSearch(source, target, { ...option, pinyinMap: pinyin })
}

/**
 * Perform a fuzzy search without the preset Pinyin collection and return the indices of the matched original characters. User need to pass pinyin map in manually
 * 在没有预设拼音集合的情况下搜索字符串，需要手动传入拼音集合
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option required, need to pass pinyin map in manually
 * @example pureSearch('mito 监控', 'mijk', { pinyinMap: { 监: ['jian'], 控: ['kong'] } }) // [[0, 1], [5, 6]]
 */
export function pureSearch(source: string, target: string, _option: SearchOptionWithPinyin) {
	if (isEmptyString(source) || isEmptyString(target)) return undefined
	const option = { ...DEFAULT_SEARCH_OPTION, ..._option }
	const [_source, _target] = option.strictCase
		? [source, target]
		: [source.toLocaleLowerCase(), target.toLocaleLowerCase()]

	const rawHitRanges = searchEntry(_source, _target, extractBoundaryMapping.bind(null, _source, option.pinyinMap))
	if (!rawHitRanges) return undefined

	if (option.isCharConsecutive && !isConsecutiveForChar(source, target, rawHitRanges)) {
		return undefined
	}

	if (option.strictnessCoefficient && !isStrictnessSatisfied(option.strictnessCoefficient, _target, rawHitRanges)) {
		return undefined
	}

	return option.mergeSpaces ? mergeSpacesWithRanges(_source, rawHitRanges) : rawHitRanges
}

/**
 * returns the highlighted string, which needs to be printed using console.log
 * 返回高亮后的字符串，需要用 console.log 打印
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @example console.log(highlightMatches('mito 监控', 'mijk'))
 */
export function highlightMatches(source: string, target: string, _option: SearchOption = {}) {
	return pureHighlightMatches(source, target, { ..._option, pinyinMap: pinyin })
}

/**
 * returns the highlighted string without the preset Pinyin collection, which needs to be printed using console.log
 * 在没有预设拼音集合的情况下搜索并返回高亮后的字符串，需要用 console.log 打印
 * @param source required, the source string you want to search
 * @param target required, the string by user input. generally speaking, it's length should be less than `source`, otherwise the result will be undefined
 * @param option optional, the default value is `{}`
 * @example console.log(pureHighlightMatches('mito 监控', 'mijk', { pinyinMap: { 监: ['jian'], 控: ['kong'] } }))
 */
export function pureHighlightMatches(source: string, target: string, option: SearchOptionWithPinyin) {
	const range = pureSearch(source, target, option)
	return range ? highlightTextWithRanges(source, range) : source
}
