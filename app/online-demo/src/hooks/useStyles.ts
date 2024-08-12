import { makeStyles } from '@mui/styles'
export const useStyles = makeStyles({
	customTextField: {
		'& .MuiInput-underline:before': {
			borderBottomColor: 'var(--color-neutral-1)',
		},
		'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
			borderBottomColor: 'var(--color-neutral-1)',
		},
		'& .MuiInput-underline:after': {
			borderBottomColor: '#1976d2',
		},
		'& .MuiInputLabel-root': {
			color: 'var(--color-neutral-5)',
		},
	},
	customListItem: {
		'&.MuiListItem-root:hover': {
			backgroundColor: 'var(--color-neutral-9)',
		},
		'& .MuiTypography-root': {
			marginTop: '0',
		},
	},
})
