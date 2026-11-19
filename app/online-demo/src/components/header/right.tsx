import { useLocation } from 'react-router-dom'
import { CHROME_EXTENSION_URL, GITHUB_URL } from '../../config'
import { IconParkNames } from '../../shared/constants'
import LinkWithIcon from '../link-with-icon'
export default function HeaderRight() {
	const location = useLocation()
	const pathname = location.pathname.replace(/\/$/, '')
	const isVisualPage = pathname === '/text-search-engine/visual'
	const isMultiFieldPage = pathname === '/text-search-engine/multi-field'

	return (
		<div className='flex' style={{ gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
			<a
				href='/text-search-engine/multi-field/'
				aria-current={isMultiFieldPage ? 'page' : undefined}
				className={`flex items-center px-2 py-1 text-sm font-medium transition-colors ${
					isMultiFieldPage ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'
				}`}
			>
				多字段搜索
			</a>
			<a
				href='/text-search-engine/visual/'
				aria-current={isVisualPage ? 'page' : undefined}
				className={`flex items-center cursor-pointer px-2 py-1 text-sm font-medium transition-colors ${
					isVisualPage ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'
				}`}
				title='算法过程可视化'
			>
				算法可视化
			</a>
			<LinkWithIcon name={IconParkNames.extensions} value={CHROME_EXTENSION_URL} type='link' />
			<LinkWithIcon name={IconParkNames.github} value={GITHUB_URL} type='link' />
		</div>
	)
}
