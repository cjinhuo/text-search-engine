import type { SnackbarOrigin } from '@mui/material'
import store from '../shared/storeUtil'
interface Iprops {
	callback?: (state: SnackbarOrigin) => void
	open?: boolean
	state?: SnackbarOrigin
}

export function useNotifyStar({ callback, state = { vertical: 'top', horizontal: 'center' } }: Iprops) {
	const isStar = store.get('isStar')
	if (isStar == null) {
		// storage expired or first-time page visit
		const timeout = 1000 * 60
		setTimeout(() => {
			callback?.({ ...state })
			store.set('isStar', '1', 60 * 60 * 24 * 30)
		}, timeout)
	}
}
