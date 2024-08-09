import { Button } from '@mui/material'
import * as TextSearchEngine from 'text-search-engine'

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
;(window as any)['_TEXT_SEARCH_ENGINE_'] = TextSearchEngine

export default function Home() {
	return (
		<div>
			{TextSearchEngine.search('nod你的名e', 'no')}
			<Button variant='outlined'>Home</Button>
		</div>
	)
}
