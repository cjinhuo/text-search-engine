import type { SnackbarOrigin } from '@mui/material'
import store from 'store'

interface Iprops {
	callback?: (state: SnackbarOrigin) => void
	open?: boolean
}

export function useNotifyStar({ callback, open }: Iprops) {
	const store_expire = new Date().getTime() + 1000 * 60 * 24 * 30
	const initConfig = () => {
		store.set('inaugural', '1')
		store.set('expire_time', new Date().getTime() + 1000 * 60)
	}
	if (!store.get('inaugural')) {
		initConfig()
	}
	let inaugural = store.get('inaugural')
	let expire_time = store.get('expire_time')
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let timer: any = null
	function openNotify() {
		const ex_strore = store.get('store_expire')
		if (inaugural === '1' && !open && callback) {
			console.log(inaugural, open)
			callback({ vertical: 'top', horizontal: 'center' })
			store.set('inaugural', '0')
			if (!ex_strore) {
				store.set('store_expire', store_expire)
			}
		}
		if (inaugural === '0') {
			const nowTime = new Date().getTime()
			if (nowTime > ex_strore) {
				initConfig()
				store.remove('store_expire')
				inaugural = store.get('inaugural')
				expire_time = store.get('expire_time')
				handleTimer()
			}
		}
	}
	function handleTimer() {
		const theTime = new Date().getTime() - expire_time
		if (theTime < 0) {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				openNotify()
			}, Math.abs(theTime))
		} else {
			openNotify()
		}
	}
	handleTimer()
}
