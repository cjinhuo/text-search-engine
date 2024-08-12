import { Card, CardContent, TextField, Typography } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
// import { Search as SearchIcon } from '@mui/icons-material';
import { INPUT_ANIMATION_CONFIG, TEXT_ACTIVE_CONFIG } from '../../config/index'
import { useDebounce } from '../../hooks/useDebounce'
import LightedText from '../LightedText'
interface HighlightTextProps {
	children?: ReactNode
	highlightedText: string
}

const TextHighlight: FC<HighlightTextProps> = (props: HighlightTextProps) => {
	const { highlightedText } = props
	const [textSearchTerm, setTextSearchTerm] = useState('')
	const [textSearchTime, setTextSearchTime] = useState(0)
	const [parts, setParts] = useState<Array<string>>([])
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [renderStr, setRenderStr] = useState<any>()
	const [resLength, setResLength] = useState<number>(0)
	const debounceValue = useDebounce(textSearchTerm, 300)
	const startTime = performance.now()
	const ranges = window._TEXT_SEARCH_ENGINE_.search(highlightedText, textSearchTerm)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// const regex = highlightedText.match(textSearchTerm)
		// console.log('regex.....', regex)
		// console.log('highlightedText.....',highlightedText)
		// console.log('highlightedText   index.....',(regex as any).index)
		// const endIdx = textSearchTerm.length+(regex as any).index
		// console.log('highlightedText   search.....',highlightedText.slice((regex as any).index,endIdx))
		const regex = new RegExp(`(${textSearchTerm})`)
		setParts(() => {
			return highlightedText.split(regex)
		})
		setRenderStr(() => {
			console.log(
				'_TEXT_SEARCH_ENGINE_.....',
				ranges
				// window._TEXT_SEARCH_ENGINE_.highlightMatches(highlightedText, textSearchTerm)
			)
			return [
				...highlightedText.split(regex).map((part, idx) =>
					textSearchTerm && regex.test(part) ? (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<span key={idx} className='bg-yellow font-bold'>
							{part}
						</span>
					) : (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<span key={idx}>{part}</span>
					)
				),
			]
		})
		let resl = 0
		let count = 0
		const endTime = performance.now()
		if (textSearchTerm) {
			const regRes = new RegExp(textSearchTerm, 'g')
			resl = highlightedText.match(regRes)?.length || 0
			count = endTime - startTime
		}

		if (!textSearchTerm) {
			resl = 0
			count = 0
		}
		setResLength(resl)
		setTextSearchTime(count)
	}, [debounceValue, highlightedText])

	return (
		<Card sx={{ transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
			<CardContent>
				<Typography variant='h5' component='div' gutterBottom>
					Text Highlighting
				</Typography>
				<TextField
					fullWidth
					label='Input keyword highlighting text...'
					value={textSearchTerm}
					onChange={(e) => setTextSearchTerm(e.target.value)}
					variant='standard'
					// InputProps={{
					//     startAdornment: <SearchIcon />,
					// }}
					sx={{ mb: 2, ...INPUT_ANIMATION_CONFIG }}
				/>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					found {resLength} matches in {textSearchTime.toFixed(2)} milliseconds
				</Typography>
				<Typography variant='body1' component='div' sx={{ ...TEXT_ACTIVE_CONFIG }}>
					{/* {renderStr} */}
					{<LightedText text={highlightedText} ranges={ranges} className='bg-yellow font-bold' />}
				</Typography>
			</CardContent>
		</Card>
	)
}
export default memo(TextHighlight)
