import { useNavigate } from 'react-router-dom'
import { IconParkNames } from '../../shared/constants'
import IconPark from '../icon-park'

export default function Logo() {
	const navigate = useNavigate()
	const handleClick = () => {
		navigate('/text-search-engine')
	}
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div onClick={handleClick} className='h-full flex cursor-pointer'>
			{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
			<IconPark
				class='text-skin-neutral-2 relative'
				style={{ bottom: '2px' }}
				name={IconParkNames['search-engine']}
				size='2.5rem'
			></IconPark>
			<div className='text-skin-neutral-3 font-medium text-3xl'>TexSearch</div>
		</div>
	)
}
