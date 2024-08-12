import { Card, CardContent, TextField, Typography } from '@mui/material'
import { memo, useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'
import { extractBoundaryMapping, searchSentenceByBoundaryMapping } from 'text-search-engine'
import { INPUT_ANIMATION_CONFIG, TEXT_ACTIVE_CONFIG } from '../../config/index'
import { useDebounce } from '../../hooks/useDebounce'
import LightedText from '../LightedText'
interface HighlightTextProps {
	originalText: string
}

const TextHighlight: FC<HighlightTextProps> = ({ originalText }: HighlightTextProps) => {
	const [textSearchTerm, setTextSearchTerm] = useState('')
	const debounceValue = useDebounce(textSearchTerm, 300)

	const sourceMappingData = useMemo(() => extractBoundaryMapping(originalText), [originalText])
	const [ranges, matchCharacters, searchTime] = useMemo(() => {
		const start = performance.now()
		const ranges = searchSentenceByBoundaryMapping(sourceMappingData, debounceValue) || []
		const matchCharacters = ranges.reduce((acc, [start, end]) => acc + end + 1 - start, 0)
		return [ranges, matchCharacters, performance.now() - start] as const
	}, [sourceMappingData, debounceValue])

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
					Matches up to {matchCharacters} characters in {searchTime.toFixed(2)} milliseconds
				</Typography>
				<Typography variant='body1' component='div' sx={{ ...TEXT_ACTIVE_CONFIG }}>
					{<LightedText text={originalText} ranges={ranges} className='bg-yellow font-bold' />}
				</Typography>
			</CardContent>
		</Card>
	)
}
export default memo(TextHighlight)
