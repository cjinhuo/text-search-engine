// biome-ignore lint/style/useImportType: <explanation>
import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { type Matrix, search } from '../index'

export const HighlightClassMap = {
	container: 'hg-container',
	normal: 'hg-normal',
	highlight: 'hg-highlight',
}

const defaultContainerStyle: React.CSSProperties = {
	display: 'flex',
	width: '100%',
	minHeight: '20px',
	fontSize: '14px',
	fontWeight: 500,
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	backgroundColor: 'transparent',
}

const defaultNormalStyle: React.CSSProperties = {
	color: '#535353',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
}

const defaultHighlightStyle: React.CSSProperties = {
	whiteSpace: 'nowrap',
	color: 'white',
	backgroundColor: 'rgb(35, 141, 255)',
	borderRadius: '4px',
	padding: '0 2px',
}

export interface HighlightWithRangesProps {
	source: string
	// Use each item as a key
	id?: string
	hitRanges?: Matrix
	highlightStyle?: React.CSSProperties
	normalStyle?: React.CSSProperties
	containerStyle?: React.CSSProperties
}

const composeStyle = (style: React.CSSProperties, className: string) => ({ style, className })

export const HighlightWithRanges: React.FC<HighlightWithRangesProps> = ({
	source,
	id,
	hitRanges,
	highlightStyle,
	normalStyle,
	containerStyle,
}) => {
	const _containerStyle = composeStyle({ ...defaultContainerStyle, ...containerStyle }, HighlightClassMap.container)
	const _normalStyle = composeStyle({ ...defaultNormalStyle, ...normalStyle }, HighlightClassMap.normal)
	const _highlightStyle = composeStyle({ ...defaultHighlightStyle, ...highlightStyle }, HighlightClassMap.highlight)
	if (!hitRanges || !hitRanges.length) {
		return (
			<div {..._containerStyle}>
				<div {..._normalStyle}>{source}</div>
			</div>
		)
	}
	const uuid = id || source.slice(0, 6)
	const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const newContent: React.ReactNode[] = []
		let lastIndex = 0

		hitRanges.forEach(([start, end], index) => {
			if (start > lastIndex) {
				const normalText = source.slice(lastIndex, start)
				newContent.push(
					<div key={`${uuid}-normal-${lastIndex}`} {..._normalStyle}>
						{normalText}
					</div>
				)
			}

			const highlightText = source.slice(start, end + 1)
			newContent.push(
				<div key={`${uuid}-highlight-${start}`} {..._highlightStyle}>
					{highlightText}
				</div>
			)

			lastIndex = end + 1
		})

		if (lastIndex < source.length) {
			const remainingText = source.slice(lastIndex)
			newContent.push(
				<div key={`${uuid}-normal-${lastIndex}`} {..._normalStyle}>
					{remainingText}
				</div>
			)
		}

		setRenderedContent(newContent)
	}, [source, hitRanges, uuid])

	return <div {..._containerStyle}>{...renderedContent}</div>
}

export interface HighlightWithTargetProps extends HighlightWithRangesProps {
	target: string
}

export const HighlightWithTarget: React.FC<HighlightWithTargetProps> = ({ source, target, ...rest }) => {
	const hitRanges = useMemo(() => {
		return search(source, target)
	}, [source, target])

	return <HighlightWithRanges source={source} hitRanges={hitRanges} {...rest} />
}
