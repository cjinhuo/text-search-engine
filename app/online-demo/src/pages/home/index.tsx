import { Container, CssBaseline, Grid2 as Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import * as TextSearchEngine from 'text-search-engine'
import ListSearch from '../../components/ListSearch'
import TextHighlight from '../../components/TextHighlight'
import { LONG_TEXT } from '../../config/data'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine

export default function Home() {
	const [listItems, setListItems] = useState<string[]>([])
	useEffect(() => {
		const items: string[] = []
		for (let i = 1; i < 101; i++) {
			const str = `item ${i}`
			items.push(str)
		}
		setListItems([...items])
	}, [])
	return (
		<div>
			<CssBaseline />
			<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '80vw!important', width: '100%' }}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6 }}>
							<ListSearch list={listItems} setList={setListItems} />
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<TextHighlight originalText={LONG_TEXT} />
						</Grid>
					</Grid>
				</Container>
			</div>
		</div>
	)
}
