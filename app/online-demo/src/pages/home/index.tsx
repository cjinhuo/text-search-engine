import { Container, Grid2 as Grid, Typography } from '@mui/material'
import * as TextSearchEngine from 'text-search-engine'
import MultiFieldEntry from '../../components/demos/multi-field-entry'
import ListSearch from '../../components/ListSearch'
import ShowTip from '../../components/showTip'

window._TEXT_SEARCH_ENGINE_ = TextSearchEngine

export default function Home() {
	return (
		<div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Container sx={{ mt: 4, mb: 4, flex: 1, maxWidth: '80vw!important', width: '100%' }}>
					<Typography component='h1' variant='h4' gutterBottom>
						JavaScript 中文拼音模糊搜索库
					</Typography>
					<Typography sx={{ mb: 1 }}>
						用中文、全拼、拼音首字母或英文搜索列表、对象字段，并高亮原文命中。
					</Typography>
					<Typography sx={{ mb: 2 }}>
						<code>npm i text-search-engine</code>
						{' · '}
						<a href='/text-search-engine/guide/' className='underline'>快速开始与选型对比</a>
						{' · '}
						<a href='/text-search-engine/en/' hrefLang='en' lang='en' className='underline'>English</a>
					</Typography>
					<Grid container spacing={3}>
						<Grid size={{ xs: 24, md: 12 }}>
							<MultiFieldEntry />
							<ListSearch />
						</Grid>
					</Grid>
				</Container>
			</div>
			<ShowTip />
		</div>
	)
}
