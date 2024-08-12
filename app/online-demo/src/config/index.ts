export const INPUT_ANIMATION_CONFIG = {
	'& .MuiInputBase-root': {
		transition: 'transform 0.3s ease-in-out',
		'&:focus-within': {
			animation: 'inputFocus 0.3s ease-in-out',
		},
	},
	'@keyframes inputFocus': {
		'0%': {
			transform: 'scale(1)',
		},
		'50%': {
			transform: 'scale(1.05)',
		},
		'100%': {
			transform: 'scale(1)',
		},
	},
}

export const TEXT_ACTIVE_CONFIG = {
	mt: 2,
	whiteSpace: 'pre-wrap',
	'& .bg-yellow': {
		backgroundColor: 'var(--color-highlight-bg)',
		transition: 'background-color 0.3s ease-in-out',
	},
	'& .bg-yellow:hover': {
		backgroundColor: 'var(--color-highlight-bg-hover)',
	},
}
