import { search } from 'text-search-engine'
import { HighlightWithRanges } from 'text-search-engine/react'

export default function DemoForHighlightWithTarget() {
	const ranges = search('Node.js 最强监控平台 V9', 'nodejk')
	return <HighlightWithRanges source='Node.js 最强监控平台 V9' hitRanges={ranges} />
}
