import { searchEntry } from './search'
import type { SearchOption, SourceMappingData } from './types'
import { isConsecutiveForChar, isStrictnessSatisfied, mergeSpacesWithRanges } from './utils'

/** 已归一化文本与查询共用的匹配流程。 */
export function searchPrepared(
	source: string,
	query: string,
	option: SearchOption,
	getBoundaryMapping: (source: string) => SourceMappingData
) {
	const { rawHitRanges, wordHitRangesMapping } = searchEntry(source, query, getBoundaryMapping)
	if (!rawHitRanges) return undefined
	if (option.isCharConsecutive && !isConsecutiveForChar(source, query, wordHitRangesMapping, rawHitRanges)) {
		return undefined
	}
	if (option.strictnessCoefficient && !isStrictnessSatisfied(option.strictnessCoefficient, query, rawHitRanges)) {
		return undefined
	}
	return option.mergeSpaces ? mergeSpacesWithRanges(source, rawHitRanges) : rawHitRanges
}
