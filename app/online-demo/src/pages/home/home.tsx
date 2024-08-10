import { Button } from '@mui/material'
import * as TextSearchEngine from 'text-search-engine'

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
;(window as any)['_TEXT_SEARCH_ENGINE_'] = TextSearchEngine

export default function Home() {
	console.log('source: mito 前端监控,target: mi jkon, result:', TextSearchEngine.search('mito 前端监控', 'mi jkon'))
	console.log(TextSearchEngine.highlightMatches('mito 前端监控', 'mi jkon '))
	return (
		<div>
			<Button variant='outlined'>Home</Button>
		</div>
	)
}
