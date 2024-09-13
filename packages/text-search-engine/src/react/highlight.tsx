// biome-ignore lint/style/useImportType: <explanation>
import React, { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { type Matrix, search } from '../index'

export const HighlightClasses = {
	container: 'hg-container',
	normal: 'hg-normal',
	highlight: 'hg-highlight',
}
const StyleId = 'text-search-style'

function injectDynamicStyles() {
	if (!document.getElementById(StyleId)) {
		const css = `
      .${HighlightClasses.container} {
        display: flex;
        width: auto;
        max-width: 100%;
        min-height: 20px;
        font-size: 14px;
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: transparent;
      }

      .${HighlightClasses.normal} {
        color: #535353;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .${HighlightClasses.highlight} {
        white-space: nowrap;
        color: white;
        background-color: rgb(35, 141, 255);
        border-radius: 4px;
        padding: 0 2px;
      }
    `
		const style = document.createElement('style')
		style.type = 'text/css'
		style.id = StyleId
		style.appendChild(document.createTextNode(css))
		document.head.appendChild(style)
	}
}

document.addEventListener('DOMContentLoaded', injectDynamicStyles)

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
	const _containerStyle = composeStyle({ ...containerStyle }, HighlightClasses.container)
	const _normalStyle = composeStyle({ ...normalStyle }, HighlightClasses.normal)
	const _highlightStyle = composeStyle({ ...highlightStyle }, HighlightClasses.highlight)
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

		for (const [start, end] of hitRanges.sort((a, b) => a[0] - b[0])) {
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
		}

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
