import { Container, CssBaseline, Grid2 as Grid } from '@mui/material'
import * as TextSearchEngine from 'text-search-engine'
import ListSearch from '../../components/ListSearch'
import TextHighlight from '../../components/TextHighlight'
import { LONG_TEXT } from '../../config/data'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine

export default function Home() {
	return (
		<div>
			<CssBaseline />
			<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '80vw!important', width: '100%' }}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 12, md: 6 }}>
							<ListSearch />
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
