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
let stylesInjected = false

function injectDynamicStyles() {
	if (typeof window !== 'undefined' && !stylesInjected && !document.getElementById(StyleId)) {
		const style = document.createElement('style')
		style.type = 'text/css'
		style.id = StyleId
		style.appendChild(document.createTextNode(css))
		document.head.appendChild(style)
		stylesInjected = true
	}
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

const replaceSpace = (text: string) => text.replace(/ /g, '\u00A0')

export const HighlightWithRanges: React.FC<HighlightWithRangesProps> = ({
	source,
	id,
	hitRanges,
	highlightStyle,
	normalStyle,
	containerStyle,
}) => {
	const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([])
	const _containerStyle = useMemo(
		() => composeStyle({ ...containerStyle }, HighlightClasses.container),
		[containerStyle]
	)
	const _normalStyle = useMemo(() => composeStyle({ ...normalStyle }, HighlightClasses.normal), [normalStyle])
	const _highlightStyle = useMemo(
		() => composeStyle({ ...highlightStyle }, HighlightClasses.highlight),
		[highlightStyle]
	)

	const uuid = useMemo(() => id || source.slice(0, 6), [id, source])

	useEffect(() => {
		injectDynamicStyles()
	}, [])

	useEffect(() => {
		if (!hitRanges || !hitRanges.length) {
			setRenderedContent([
				<div key={`${uuid}-normal`} {..._normalStyle}>
					{source}
				</div>,
			])
			return
		}

		const newContent: React.ReactNode[] = []
		let lastIndex = 0

		for (const [start, end] of hitRanges.sort((a, b) => a[0] - b[0])) {
			if (start > lastIndex) {
				newContent.push(
					<div key={`${uuid}-normal-${lastIndex}`} {..._normalStyle}>
						{replaceSpace(source.slice(lastIndex, start))}
					</div>
				)
			}

			newContent.push(
				<div key={`${uuid}-highlight-${start}`} {..._highlightStyle}>
					{replaceSpace(source.slice(start, end + 1))}
				</div>
			)
			lastIndex = end + 1
		}

		if (lastIndex < source.length) {
			newContent.push(
				<div key={`${uuid}-normal-${lastIndex}`} {..._normalStyle}>
					{replaceSpace(source.slice(lastIndex))}
				</div>
			)
		}

		setRenderedContent(newContent)
	}, [source, hitRanges, uuid, _normalStyle, _highlightStyle])

	return <div {..._containerStyle}>{renderedContent}</div>
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
