/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundColor: {
				skin: {
					background: 'var(--color-normal-bg)',
					'background-reverse': 'var(--color-normal-bg-reverse)',
				},
			},
			maxWidth: {
				custom: {
					prose: 'var(--max-w-65)',
				},
			},
			textColor: {
				skin: {
					'neutral-1': 'var(--color-neutral-1)',
					'neutral-2': 'var(--color-neutral-2)',
					'neutral-3': 'var(--color-neutral-3)',
					'neutral-4': 'var(--color-neutral-4)',
					'neutral-5': 'var(--color-neutral-5)',
					'neutral-6': 'var(--color-neutral-6)',
					'neutral-7': 'var(--color-neutral-7)',
					'neutral-8': 'var(--color-neutral-8)',
					'neutral-9': 'var(--color-neutral-9)',
					'neutral-10': 'var(--color-neutral-10)',
					link: 'var(--color-link-href)',
				},
			},
		},
	},
	plugins: [],
}
