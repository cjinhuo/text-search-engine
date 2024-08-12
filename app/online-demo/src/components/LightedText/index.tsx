import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
interface ILightedFuncProps {
	text: string
	ranges?: Array<Array<number>>
	className: string
	children?: ReactNode
}
const LightedText: FC<ILightedFuncProps> = memo(({ text, ranges, className }) => {
	// If there is no scope, return directly to the original text
	if (!ranges || ranges.length === 0) {
		return <span>{text}</span>
	}
	console.log('ranges..', ranges)

	// Sort the ranges to ensure they are processed in order
	const sortedRanges = [...ranges].sort((a, b) => a[0] - b[0])

	const result = []
	let lastIndex = 0

	sortedRanges.forEach(([start, end], index) => {
		// Adding Unhighlighted Text
		if (start > lastIndex) {
			result.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, start)}</span>)
		}

		lastIndex = end + 1
		// Add highlighted text
		result.push(
			<span key={`highlight-${[start, end].join('-')}`} className={className}>
				{text.slice(start, lastIndex)}
			</span>
		)
	})

	// Add last paragraph of unhighlighted text (if any)
	if (lastIndex < text.length) {
		result.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>)
	}

	return <>{result}</>
})

export default memo(LightedText)
