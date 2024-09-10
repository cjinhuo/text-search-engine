import { Container, CssBaseline, Grid2 as Grid } from '@mui/material'
import * as TextSearchEngine from 'text-search-engine'
import ListSearch from '../../components/ListSearch'
import ShowTip from '../../components/showTip'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine

export default function Home() {
	return (
		<div>
			<CssBaseline />
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '80vw!important', width: '100%' }}>
					<Grid container spacing={3}>
						<Grid size={{ xs: 24, md: 12 }}>
							<ListSearch />
						</Grid>
					</Grid>
				</Container>
			</div>
			<ShowTip />
		</div>
	)
}
