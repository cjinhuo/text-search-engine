import type React from 'react'

type IconParkProps = {
	name: string
	size?: string
	width?: string
	height?: string
	color?: string
	stroke?: string
	fill?: string
	rtl?: string
	spin?: string
	class?: string
	style?: React.CSSProperties
}
export default function IconPark(props: IconParkProps) {
	return (
		<iconpark-icon
			size='1.3rem'
			style={{ transition: 'color 0.1s' }}
			class='text-skin-neutral-7 hover:text-skin-neutral-5'
			{...props}
		/>
	)
}
