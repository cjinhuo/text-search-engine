import type { SnackbarOrigin } from '@mui/material/Snackbar'
import { useMemo, useState } from 'react'
import { useNotifyStar } from './useNotifyStar'

interface State extends SnackbarOrigin {
	open: boolean
}

export function useStarNotification() {
	const [notificationState, setNotificationState] = useState<State>({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	})

	const duration = useMemo(() => 1000 * 6, [])

	const openNotification = (newState: SnackbarOrigin) => {
		setNotificationState({ ...newState, open: true })
	}

	const closeNotification = () => {
		setNotificationState((prev) => ({ ...prev, open: false }))
	}

	useNotifyStar({
		callback: openNotification,
		state: notificationState,
	})

	return {
		notificationState,
		duration,
		closeNotification,
	}
}
