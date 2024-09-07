import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { type Matrix, search } from 'text-search-engine'

interface HighlightComponentProps {
	source: string
	hitRanges: Matrix
	width?: string | number
	highlightStyle?: React.CSSProperties
}

export const HighlightComponent: React.FC<HighlightComponentProps> = ({
	source,
	hitRanges,
	width = '100%',
	highlightStyle = { backgroundColor: 'yellow' },
}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([])

	const measureText = useCallback((text: string) => {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		if (context) {
			context.font = getComputedStyle(document.body).font
			return context.measureText(text).width
		}
		return text.length * 8 // Fallback approximation
	}, [])

	const updateContent = useCallback(() => {
		if (!containerRef.current) return

		const containerWidth = containerRef.current.offsetWidth
		const newContent: React.ReactNode[] = []
		let lastIndex = 0

		// Calculate total width of highlighted spans
		const highlightWidths = hitRanges.map(([start, end]) => measureText(source.slice(start, end + 1)))
		const totalHighlightWidth = highlightWidths.reduce((sum, width) => sum + width, 0)

		// Calculate available width for non-highlighted spans
		const availableNonHighlightWidth = containerWidth - totalHighlightWidth
		const nonHighlightRanges = hitRanges.reduce(
			(ranges, [start, end], index) => {
				if (index === 0 && start > 0) ranges.push([0, start - 1])
				if (index < hitRanges.length - 1) ranges.push([end + 1, hitRanges[index + 1][0] - 1])
				if (index === hitRanges.length - 1 && end < source.length - 1) ranges.push([end + 1, source.length - 1])
				return ranges
			},
			[] as [number, number][]
		)

		// Distribute available width among non-highlighted spans
		const nonHighlightWidths = nonHighlightRanges.map(([start, end]) => measureText(source.slice(start, end + 1)))
		const totalNonHighlightWidth = nonHighlightWidths.reduce((sum, width) => sum + width, 0)
		const widthRatio = availableNonHighlightWidth / totalNonHighlightWidth

		let currentWidth = 0
		hitRanges.forEach(([start, end], index) => {
			// Add non-highlighted text before this range
			if (start > lastIndex) {
				const text = source.slice(lastIndex, start)
				const originalWidth = measureText(text)
				const allocatedWidth = originalWidth * widthRatio

				if (allocatedWidth >= 20) {
					// Minimum width to show some text
					const visibleText = `${text.slice(0, Math.floor(text.length * (allocatedWidth / originalWidth) - 3))}...`
					newContent.push(<span key={`text-${lastIndex}`}>{visibleText}</span>)
				} else {
					newContent.push(<span key={`ellipsis-${lastIndex}`}>...</span>)
				}
				currentWidth += allocatedWidth
			}

			// Add highlighted text
			const highlightText = source.slice(start, end + 1)
			newContent.push(
				<span key={`highlight-${start}`} style={highlightStyle}>
					{highlightText}
				</span>
			)
			currentWidth += highlightWidths[index]
			lastIndex = end + 1
		})

		// Add remaining text after last highlight
		if (lastIndex < source.length) {
			const remainingText = source.slice(lastIndex)
			const remainingWidth = measureText(remainingText)
			const allocatedWidth = remainingWidth * widthRatio

			if (allocatedWidth >= 20) {
				const visibleText = `${remainingText.slice(0, Math.floor(remainingText.length * (allocatedWidth / remainingWidth) - 3))}...`
				newContent.push(<span key={`text-${lastIndex}`}>{visibleText}</span>)
			} else {
				newContent.push(<span key='ellipsis-end'>...</span>)
			}
		}

		setRenderedContent(newContent)
	}, [source, hitRanges, highlightStyle, measureText])

	useEffect(() => {
		const resizeObserver = new ResizeObserver(updateContent)
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current)
		}
		updateContent() // Initial render
		return () => resizeObserver.disconnect()
	}, [updateContent])

	return (
		<div
			ref={containerRef}
			style={{
				width,
				whiteSpace: 'nowrap',
				overflow: 'hidden',
			}}
		>
			{renderedContent}
		</div>
	)
}

interface TextSearchProps {
	source: string
	target?: string
	onSearch?: (hitRanges: Matrix) => void
	width?: string | number
	highlightStyle?: React.CSSProperties
	children?: React.ReactNode
}

export const TextSearch: React.FC<TextSearchProps> = ({
	source,
	target,
	onSearch,
	width = 'auto',
	highlightStyle,
	children,
}) => {
	const [internalTarget, setInternalTarget] = useState(target || '')
	const [hitRanges, setHitRanges] = useState<Matrix>([])

	const handleSearch = useCallback(
		(searchTarget: string) => {
			const result = search(source, searchTarget)
			setHitRanges(result || [])
			if (onSearch) {
				onSearch(result || [])
			}
		},
		[source, onSearch]
	)

	useEffect(() => {
		if (target !== undefined) {
			setInternalTarget(target)
			handleSearch(target)
		}
	}, [target, handleSearch])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTarget = e.target.value
		setInternalTarget(newTarget)
		handleSearch(newTarget)
	}

	return (
		<div style={{ width }}>
			{target === undefined && (
				<input
					type='text'
					value={internalTarget}
					onChange={handleInputChange}
					placeholder='输入搜索文本'
					style={{
						width: '100%',
						marginBottom: '10px',
						padding: '8px 12px',
						fontSize: '16px',
						border: '2px solid #007bff',
						borderRadius: '4px',
						outline: 'none',
					}}
				/>
			)}
			{children || (
				<HighlightComponent source={source} hitRanges={hitRanges} width='100%' highlightStyle={highlightStyle} />
			)}
		</div>
	)
}
