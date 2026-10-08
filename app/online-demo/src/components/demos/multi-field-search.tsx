import { Card, CardContent, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { createSearcher } from 'text-search-engine'
import { HighlightWithRanges } from 'text-search-engine/react'

const items = [
	{ title: 'React 监控平台', host: 'github.com' },
	{ title: 'TypeScript 文档', host: 'typescriptlang.org' },
]

export default function MultiFieldSearch() {
	const [query, setQuery] = useState('jk github')
	const searcher = useMemo(
		() => createSearcher(items, { getFields: (item) => ({ title: item.title, host: item.host }) }),
		[]
	)
	const results = searcher.search(query)
	return (
		<Card sx={{ mt: 3 }}>
			<CardContent>
				<Typography variant='h5' gutterBottom>
					Search title and host
				</Typography>
				<TextField
					fullWidth
					label='Try jk github or typescript'
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				{query.trim()
					? results.map(({ item, index, fieldHitRanges }) => (
							<div key={index} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
								<HighlightWithRanges source={item.title} hitRanges={fieldHitRanges.title} />
								{' · '}
								<HighlightWithRanges source={item.host} hitRanges={fieldHitRanges.host} />
							</div>
						))
					: items.map((item) => (
							<div key={item.host}>
								{item.title} · {item.host}
							</div>
						))}
				{query.trim() && results.length === 0 && <Typography sx={{ mt: 2 }}>No Matches Found</Typography>}
			</CardContent>
		</Card>
	)
}
