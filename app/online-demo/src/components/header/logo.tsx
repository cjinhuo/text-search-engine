import { useNavigate } from 'react-router-dom'
import { IconParkNames } from '../../shared/constants'
import IconPark from '../icon-park'

export default function Logo() {
	const navigate = useNavigate()
	const handleClick = () => {
		navigate('/text-search-engine')
	}
	return (
		<button type='button' onClick={handleClick} className='h-full flex cursor-pointer bg-transparent border-0'>
			<IconPark
				class='text-skin-neutral-2 relative'
				style={{ bottom: '2px' }}
				name={IconParkNames['text-search']}
				size='2.5rem'
			/>
			<div className='text-skin-neutral-3 font-medium text-3xl'>Text Search Engine</div>
		</button>
	)
}
