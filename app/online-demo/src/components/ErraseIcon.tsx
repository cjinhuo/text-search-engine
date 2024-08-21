import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
interface Iprops {
	children?: ReactNode
}
const ErraseIcon: FC<Iprops> = () => {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 48 48' fill='none'>
			<path d='M4 42H44' stroke='#9b9b9b' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' />
			<path
				d='M31 4L7 28L13 34H21L41 14L31 4Z'
				fill='none'
				stroke='#9b9b9b'
				stroke-width='4'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</svg>
	)
}
export default memo(ErraseIcon)
