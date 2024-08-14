import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import type { TransitionProps } from '@mui/material/transitions'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		children: React.ReactElement<any, any>
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />
})

interface Iprops {
	children?: ReactNode
	title?: string
	open: boolean
	content?: string | ReactNode
	showConfirmlButton?: boolean
	showCancelButton?: boolean
	confirmButtonText?: string
	cancelButtonText?: string
	handleClose?: React.MouseEventHandler<HTMLButtonElement> | undefined
	handleConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined
}
const DialogBox: FC<Iprops> = (props) => {
	const {
		title,
		open,
		content,
		showConfirmlButton = true,
		showCancelButton = true,
		confirmButtonText = 'Agree',
		cancelButtonText = 'Cancel',
		handleClose,
		handleConfirm,
	} = props

	return (
		<React.Fragment>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby='alert-dialog-slide-description'
			>
				{title && <DialogTitle>{title}</DialogTitle>}
				<DialogContent>
					<DialogContentText id='alert-dialog-slide-description'>{content}</DialogContentText>
				</DialogContent>
				<DialogActions>
					{showCancelButton && <Button onClick={handleClose}>{cancelButtonText}</Button>}
					{showConfirmlButton && <Button onClick={handleConfirm}>{confirmButtonText}</Button>}
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}
export default memo(DialogBox)
