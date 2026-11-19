import { IconParkNames } from '../../shared/constants'
import IconPark from '../icon-park'

export default function Logo() {
	return (
		<a href='/text-search-engine/' className='flex items-center cursor-pointer bg-transparent border-0'>
			<IconPark
				class='text-skin-neutral-2 relative'
				style={{ bottom: '2px' }}
				name={IconParkNames['text-search']}
				size='2.5rem'
			/>
			<div className='text-skin-neutral-3 font-medium' style={{ fontSize: 'clamp(1.1rem, 3vw, 1.875rem)' }}>
				Text Search Engine
			</div>
		</a>
	)
}
