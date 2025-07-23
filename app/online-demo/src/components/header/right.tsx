import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { CHROME_EXTENSION_URL, GITHUB_URL } from '../../config'
import { IconParkNames } from '../../shared/constants'
import LinkWithIcon from '../link-with-icon'
import Theme from './theme'
export default function HeaderRight() {
	const navigate = useNavigate()
	const location = useLocation()

	const handleVisualClick = () => {
		navigate('/text-search-engine/visual')
	}

	const isVisualPage = location.pathname === '/text-search-engine/visual'

	return (
		<div className='h-full flex' style={{ gap: '1.2rem' }}>
			<motion.div
				whileHover={{ scale: 1.05 }}
				className={`flex items-center cursor-pointer px-2 py-1 text-sm font-medium transition-colors ${
					isVisualPage ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'
				}`}
				onClick={handleVisualClick}
				title='算法过程可视化'
			>
				算法可视化
			</motion.div>
			<LinkWithIcon name={IconParkNames.extensions} value={CHROME_EXTENSION_URL} type='link' />
			<LinkWithIcon name={IconParkNames.github} value={GITHUB_URL} type='link' />
			{/* <Theme /> */}
		</div>
	)
}
