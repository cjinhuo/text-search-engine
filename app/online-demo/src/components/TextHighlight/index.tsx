import { Card, CardContent, TextField, Typography } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
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
	const [resLength, setResLength] = useState<number>(0)
	const debounceValue = useDebounce(textSearchTerm, 300)
	const startTime = performance.now()
	const ranges = window._TEXT_SEARCH_ENGINE_.search(highlightedText, textSearchTerm) || []

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let resl = 0
		let count = 0
		const endTime = performance.now()
		if (textSearchTerm) {
			count = endTime - startTime
			// biome-ignore lint/complexity/noForEach: <explanation>
			ranges.forEach(([start, end]) => {
				resl += end + 1 - start
			})
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
					sx={{ mb: 2, ...INPUT_ANIMATION_CONFIG }}
				/>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					Matches up to {resLength} characters in {textSearchTime.toFixed(2)} milliseconds
				</Typography>
				<Typography variant='body1' component='div' sx={{ ...TEXT_ACTIVE_CONFIG }}>
					{<LightedText text={highlightedText} ranges={ranges} className='bg-yellow font-bold' />}
				</Typography>
			</CardContent>
		</Card>
	)
}
export default memo(TextHighlight)
