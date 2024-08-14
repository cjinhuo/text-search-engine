import Snackbar from '@mui/material/Snackbar'
import type { SnackbarOrigin } from '@mui/material/Snackbar'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface State extends SnackbarOrigin {
	open: boolean
}
interface Iprops {
	children?: ReactNode
	content?: string | ReactNode
	state: State
	duration?: number
	handleClose?: () => void
}

const SnackTip: FC<Iprops> = (props) => {
	const { content, state, handleClose, duration = 6000 } = props
	const { vertical, horizontal, open } = state
	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				onClose={handleClose}
				autoHideDuration={duration}
				message={content}
				key={vertical + horizontal}
				sx={{
					'& .MuiSnackbarContent-root': {
						backgroundColor: 'var(--color-linear-bg-end)',
						color: 'var(--color-neutral-2)',
					},
				}}
			/>
		</>
	)
}
export default memo(SnackTip)
