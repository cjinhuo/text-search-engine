import type * as TextSearchEngine from 'text-search-engine'

declare global {
	interface Window {
		_TEXT_SEARCH_ENGINE_: typeof TextSearchEngine
	}
}
