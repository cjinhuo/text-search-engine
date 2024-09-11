import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { type Matrix, search } from '../index'

const HIGHLIGHT_TEXT_CLASS = 'hg-text'
const NORMAL_TEXT_CLASS = 'nm-text'

const defaultContainerStyle: React.CSSProperties = {
	display: 'flex',
	width: '100%',
	minHeight: '20px',
	fontSize: '14px',
	fontWeight: 500,
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	backgroundColor: 'white',
}

const defaultNormalStyle: React.CSSProperties = {
	color: '#666',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
}

const defaultHighlightStyle: React.CSSProperties = {
	whiteSpace: 'nowrap',
	color: ' #000',
	backgroundColor: '#ffffff',
	borderRadius: '4px',
	padding: '0 2px',
}

interface HighlightComponentProps {
	source: string
	hitRanges: Matrix
	highlightStyle?: React.CSSProperties
	normalStyle?: React.CSSProperties
	containerStyle?: React.CSSProperties
}

export const HighlightComponent: React.FC<HighlightComponentProps> = ({
	source,
	hitRanges,
	highlightStyle,
	normalStyle,
	containerStyle,
}) => {
	const [renderedContent, setRenderedContent] = useState<React.ReactNode[]>([])

	useEffect(() => {
		const newContent: React.ReactNode[] = []
		let lastIndex = 0

		hitRanges.forEach(([start, end], index) => {
			if (start > lastIndex) {
				const normalText = source.slice(lastIndex, start)
				newContent.push(
					<span key={`normal-${lastIndex}`} className={NORMAL_TEXT_CLASS}>
						{normalText}
					</span>
				)
			}

			const highlightText = source.slice(start, end + 1)
			newContent.push(
				<span key={`highlight-${start}`} className={HIGHLIGHT_TEXT_CLASS} style={highlightStyle}>
					{highlightText}
				</span>
			)

			lastIndex = end + 1
		})

		if (lastIndex < source.length) {
			const remainingText = source.slice(lastIndex)
			newContent.push(
				<span key={`normal-${lastIndex}`} className={NORMAL_TEXT_CLASS}>
					{remainingText}
				</span>
			)
		}

		setRenderedContent(newContent)
	}, [source, hitRanges, highlightStyle])

	return (
		<div style={{ ...defaultContainerStyle, ...containerStyle }}>
			{renderedContent.map((node) =>
				React.isValidElement(node)
					? React.cloneElement(node, {
							style: {
								...(node.props.style || {}),
								...(node.props.className === HIGHLIGHT_TEXT_CLASS
									? { ...defaultHighlightStyle, ...highlightStyle }
									: { ...defaultNormalStyle, ...normalStyle }),
							},
						} as React.HTMLAttributes<HTMLSpanElement>)
					: node
			)}
		</div>
	)
}

interface TextSearchProps {
	source: string
	target?: string
	onSearch?: (hitRanges: Matrix) => void
	highlightStyle?: React.CSSProperties
	normalStyle?: React.CSSProperties
	containerStyle?: React.CSSProperties
	children?: React.ReactNode
}

export const TextSearch: React.FC<TextSearchProps> = ({
	source,
	target,
	onSearch,
	highlightStyle,
	normalStyle,
	containerStyle,
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
		<div>
			{/* 
			  // 搜索输入框组件
			  // 注：此输入框暂时不需要，但在未来的 ListSearch 组件中可能会用到
			  // 暂时注释掉，以便将来参考或使用
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
			*/}
			{children || (
				<HighlightComponent
					source={source}
					hitRanges={hitRanges}
					highlightStyle={highlightStyle}
					normalStyle={normalStyle}
					containerStyle={containerStyle}
				/>
			)}
		</div>
	)
}

export default TextSearch
