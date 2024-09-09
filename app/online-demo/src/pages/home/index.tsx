import { Container, CssBaseline, Grid2 as Grid } from '@mui/material'
import { HighlightComponent, TextSearch } from '@text-search-engine/react'
import { useState } from 'react'
import * as TextSearchEngine from 'text-search-engine'
import type { Matrix } from 'text-search-engine'
import ListSearch from '../../components/ListSearch'
import ShowTip from '../../components/showTip'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine

export default function Home() {
	const [hitRanges, setHitRanges] = useState<Matrix>([])
	const [targetState, setTargetState] = useState('')
	const [newHitRanges, setNewHitRanges] = useState<Matrix>([
		[0, 3],
		[10, 15],
	])

	const handleNewSearch = (ranges: Matrix) => {
		setNewHitRanges(ranges)
		console.log('New search result:', ranges)
	}

	return (
		<div>
			<CssBaseline />
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '80vw!important', width: '100%' }}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 24, md: 12 }}>
							<ListSearch />
						</Grid>
						<Grid size={{ xs: 24, md: 12 }}>
							<TextSearch source='这是一段需要搜索的长文本。可以在这里搜索任何内容。' target='搜索' />
						</Grid>
						<Grid size={{ xs: 24, md: 12 }}>
							<h3>新的 TextSearch 示例</h3>
							<TextSearch
								source='这是使用新的 TextSearch 组件的示例文本。你可以在这里输入并搜索任何内容。这是使用新的 TextSearch 组件的示例文本。你可以在这里输入并搜索任何内容这是使用新的 TextSearch 组件的示例文本。你可以在这里输入并搜索任何内容'
								onSearch={handleNewSearch}
							/>
						</Grid>
					</Grid>
				</Container>
			</div>
			<ShowTip />
		</div>
	)
}
